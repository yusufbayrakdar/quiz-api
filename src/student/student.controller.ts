import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";

import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { StudentService } from "./student.service";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { StudentDto } from "./dto/student.dto";
import { ExceptionBadRequest } from "src/utilities/exceptions";
import { STUDENT_ALREADY_EXIST } from "src/utilities/errors";

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

  @Post()
  @UseGuards(UserGuard)
  async create(
    @User("_id") instructorId: string,
    @Body() studentDto: StudentDto
  ) {
    const foundStudent = await this.studentService.findOneByNickName(
      studentDto.nickname
    );

    let createdStudent;
    if (!foundStudent) {
      createdStudent = await this.studentService.findOneAndUpdate(
        Object.assign(studentDto, { passwordInit: true }),
        {},
        true
      );
    }
    if (
      !foundStudent ||
      (foundStudent.firstName === studentDto.firstName &&
        foundStudent.lastName === studentDto.lastName)
    ) {
      const studentId =
        foundStudent?._id || createdStudent ? createdStudent?._id : null;
      if (studentId) {
        await this.studentService.createRelation({
          instructorId,
          studentId,
        });
      }
    } else {
      throw new ExceptionBadRequest(STUDENT_ALREADY_EXIST);
    }
  }

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
