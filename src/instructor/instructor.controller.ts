import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { InstructorService } from "./instructor.service";

@Controller("instructors")
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get()
  async list(@Query() query: PaginationQueryDto) {
    return await this.instructorService.list(query);
  }

  @Get(":_id")
  async detail(@Param("_id") instructorId: string) {
    return await this.instructorService.detail(instructorId);
  }

  @Get(":_id/confirm")
  async confirm(@Param("_id") instructorId: string) {
    const confirmed = Boolean(
      await this.instructorService.confirm(instructorId)
    );

    return { confirmed };
  }

  @Get(":_id/cancel")
  async cancel(@Param("_id") instructorId: string) {
    const canceled = Boolean(await this.instructorService.cancel(instructorId));

    return { canceled };
  }

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") instructorId: string) {
    return await this.instructorService.getProfile(instructorId);
  }
}
