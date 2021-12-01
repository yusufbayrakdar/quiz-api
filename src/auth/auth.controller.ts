import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";

import { StaffService } from "src/staff/staff.service";
import { InstructorService } from "src/instructor/instructor.service";
import { StudentService } from "src/student/student.service";
import { ExceptionAlreadyExist } from "src/utilities/exceptions";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import {
  INSTRUCTOR_ALREADY_EXIST,
  INSTRUCTOR_DOES_NOT_EXIST,
} from "src/utilities/errors";
import { UserGuard } from "src/utilities/guards/user.guard";
import { StudentDto } from "src/student/dto/student.dto";
import { User } from "src/utilities/decorators/user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly instructorService: InstructorService,
    private readonly studentService: StudentService,
    private readonly staffService: StaffService
  ) {}

  @Post("register/instructor")
  async instructorCreate(@Body() instructorDto: RegisterDto) {
    const phoneAlreadyExist = await this.instructorService.checkPhone(
      instructorDto.phone
    );

    if (phoneAlreadyExist)
      throw new ExceptionAlreadyExist(INSTRUCTOR_ALREADY_EXIST);

    const instructor = await this.instructorService.create(instructorDto);

    const token = this.authService.generateInstructorToken(
      instructor._id,
      instructor.phone
    );
    return { instructor, token };
  }

  @Post("register/student")
  @UseGuards(UserGuard)
  async register(@Body() studentDto: StudentDto, @User("_id") _id: string) {
    const instructorExists = await this.instructorService.exists({ _id });
    if (!instructorExists)
      throw new BadRequestException(INSTRUCTOR_DOES_NOT_EXIST);
    return await this.studentService.createOrUpdate(studentDto, _id);
  }

  @Post("login/instructor")
  async loginInstructor(@Body() instructorDto: LoginDto) {
    const instructor = await this.instructorService.findByLogin(instructorDto);

    const token = this.authService.generateInstructorToken(
      instructor._id,
      instructor.phone
    );
    return { instructor, token };
  }

  @Post("login/student")
  async loginStudent(@Body() instructorDto: LoginDto) {
    const instructor = await this.studentService.findByLogin(instructorDto);

    const token = this.authService.generateStudentToken(
      instructor._id,
      instructor.phone
    );
    return { instructor, token };
  }

  @Post("login/staff")
  async loginStaff(@Body() instructorDto: LoginDto) {
    const instructor = await this.staffService.findByLogin(instructorDto);

    const tokenstaff = this.authService.generateTokenStaff(
      instructor._id,
      instructor.phone
    );
    return { instructor, tokenstaff };
  }
}
