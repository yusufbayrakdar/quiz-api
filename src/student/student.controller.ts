import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { StudentService } from "./student.service";
import { InstructorService } from "../instructor/instructor.service";

@Controller("students")
export class StudentController {
  constructor(
    private readonly instructorService: InstructorService,
    private readonly studentService: StudentService
  ) {}

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
