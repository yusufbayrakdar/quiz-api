import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { ScoreService } from "../score/score.service";

@Controller("scores")
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @UseGuards(UserGuard)
  @Get()
  async paginate(
    @Query() query: PaginationQueryDto,
    @User("_id") student: string
  ) {
    return await this.scoreService.paginate({ ...query, student });
  }

  @UseGuards(UserGuard)
  @Get(":_id")
  async detail(@IdParam() _id: string, @User("_id") student: string) {
    return await this.scoreService.detail(_id, student);
  }
}
