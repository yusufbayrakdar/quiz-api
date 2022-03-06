import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";

import { StaffService } from "src/staff/staff.service";
import { InstructorService } from "src/instructor/instructor.service";
import { StudentService } from "src/student/student.service";
import { ExceptionBadRequest } from "src/utilities/exceptions";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { FAILED_LOGIN } from "src/utilities/errors";
import { UserGuard } from "src/utilities/guards/user.guard";
import { User } from "src/utilities/decorators/user.decorator";
import { LoginStaffDto } from "./dto/login-staff.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly instructorService: InstructorService,
    private readonly studentService: StudentService,
    private readonly staffService: StaffService
  ) {}

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") userId: string) {
    const instructor = await this.instructorService.getProfile(userId);
    if (instructor) return { instructor };
    const student = await this.studentService.getProfile(userId);
    if (student) return { student };
    throw new ExceptionBadRequest(FAILED_LOGIN);
  }

  @Post("login")
  async loginInstructor(@Body() loginDto: LoginDto) {
    const instructor = await this.instructorService.findByLogin(loginDto);
    const student = await this.studentService.findByLogin(loginDto);

    if (instructor) {
      const token = this.authService.generateInstructorToken(
        instructor._id,
        instructor.phone
      );
      return { instructor, token };
    } else if (student) {
      const token = this.authService.generateStudentToken(
        student._id,
        student.nickname
      );
      return { student, token };
    } else throw new ExceptionBadRequest(FAILED_LOGIN);
  }

  @Post("login-staff")
  async loginStaff(@Body() instructorDto: LoginStaffDto) {
    const staff = await this.staffService.findByLogin(instructorDto);

    const tokenstaff = this.authService.generateTokenStaff(
      staff._id,
      staff.nickname
    );
    return { staff, tokenstaff };
  }
}
