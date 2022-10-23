import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { ScoreService } from "../score/score.service";
import { UserService } from "src/user/user.service";
import ROLES from "src/utilities/roles";

@Controller("scores")
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly userService: UserService
  ) {}

  @UseGuards(UserGuard)
  @Get()
  async paginate(@Query() query: PaginationQueryDto, @User() user: any) {
    let restrictFilter: any = {};
    if (user.role === ROLES.INSTRUCTOR && !query.student) {
      const studentIds = await this.userService.getStudentsOfInstructor(
        user._id
      );
      restrictFilter = { student: { $in: studentIds } };
    }
    if (user.role === ROLES.STUDENT) {
      restrictFilter = { student: user._id };
    }
    return await this.scoreService.paginate({ ...query, ...restrictFilter });
  }

  @UseGuards(UserGuard)
  @Get(":_id")
  async detail(@IdParam() _id: string, @User("_id") student: string) {
    return await this.scoreService.detail(_id, student);
  }
}
