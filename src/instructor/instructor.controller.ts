import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { InstructorService } from "./instructor.service";

@Controller("instructors")
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get(":_id/confirm")
  async confirm(@Param("_id") instructorId: string) {
    const confirmed = Boolean(
      await this.instructorService.confirm(instructorId)
    );

    return { confirmed };
  }

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") instructorId: string) {
    return await this.instructorService.getProfile(instructorId);
  }
}
