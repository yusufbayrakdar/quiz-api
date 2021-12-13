import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { StudentService } from "./student.service";
import { InstructorService } from "../instructor/instructor.service";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async list(@Query() query: PaginationQueryDto) {
    if (query.instructor) {
      return await this.studentService.studentsOfInstructor(query);
    }
    return await this.studentService.list(query);
  }

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
