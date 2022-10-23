import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "src/auth/auth.service";
import { RegisterDtoInstructor } from "src/auth/dto/register-instructor.dto";
import { RegisterDtoStudent } from "src/auth/dto/register-student.dto";
import { QuizStudentService } from "src/quiz-student/quiz-student.service";
import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { User } from "src/utilities/decorators/user.decorator";
import {
  SOMETHING_WENT_WRONG,
  STUDENT_ALREADY_EXIST,
  UNAUTHORIZED_REQUEST,
  USER_ALREADY_EXIST,
} from "src/utilities/errors";
import {
  ExceptionAlreadyExist,
  ExceptionBadRequest,
} from "src/utilities/exceptions";
import { AdminGuard } from "src/utilities/guards/admin.guard";
import { InstructorGuard } from "src/utilities/guards/instructor.guard";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import ROLES from "src/utilities/roles";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { UserSelects } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly quizStudentService: QuizStudentService
  ) {}

  @Get()
  @UseGuards(InstructorGuard)
  async list(@User() user, @Query() query: PaginationQueryDto) {
    let select = "";
    if (query.role === ROLES.STUDENT) {
      const filterNeeded = user.role !== ROLES.ADMIN;
      const adminInstructorSnap = !filterNeeded && query.instructor;
      if (filterNeeded || adminInstructorSnap || query.isOwner) {
        const studentIds = await this.userService.getStudentsOfInstructor(
          adminInstructorSnap ? adminInstructorSnap : user._id
        );
        query._id = {
          [filterNeeded || query.isOwner === "true" || adminInstructorSnap
            ? "$in"
            : "$nin"]: studentIds,
        };
      }
      select = UserSelects.STUDENT.withPassword;
    }
    let includeAdmin = {};
    if (query.role === ROLES.INSTRUCTOR) {
      includeAdmin = {
        role: {
          $in: [ROLES.ADMIN, ROLES.INSTRUCTOR],
        },
      };
    }
    return await this.userService.paginate(
      { isActive: true, ...query, ...includeAdmin },
      select
    );
  }

  @Get("add-student/:_id")
  @UseGuards(AdminGuard)
  async addStudent(@User("_id") admin, @IdParam() student: string) {
    await this.userService.add({ student, instructor: admin });
  }

  @Post("add-student-to-instructors")
  @UseGuards(AdminGuard)
  async addStudentToInstructors(
    @Body() { _id, instructors }: { _id: string; instructors: Array<string> }
  ) {
    for (let i = 0; i < instructors.length; i++) {
      await this.userService.add({ student: _id, instructor: instructors[i] });
    }
    await this.userService.updateManyStudentInstructor(
      { student: _id, instructor: { $nin: instructors, $ne: null } },
      { isActive: false },
      { upsert: false }
    );
  }

  @Post("add-students-to-instructor")
  @UseGuards(AdminGuard)
  async addStudentsToInstructor(
    @Body() { _id, students }: { _id: string; students: Array<string> }
  ) {
    for (let i = 0; i < students.length; i++) {
      await this.userService.add({ instructor: _id, student: students[i] });
    }
    await this.userService.updateManyStudentInstructor(
      { instructor: _id, student: { $nin: students, $ne: null } },
      { isActive: false },
      { upsert: false }
    );
  }

  @Get("instructors")
  @UseGuards(AdminGuard)
  async getInstructorsOfStudent(@Query() { student }: { student: string }) {
    const assignedInstructorIds =
      await this.userService.getInstructorsOfStudent(student);

    const assignedInstructors = await this.userService.find(
      {
        _id: { $in: assignedInstructorIds },
        isActive: true,
      },
      UserSelects.INSTRUCTOR.basic
    );

    for (let i = 0; i < assignedInstructors.length; i++) {
      assignedInstructors[i].assigned = true;
    }

    const notAssignedInstructors = await this.userService.find(
      {
        _id: { $nin: assignedInstructorIds },
        isActive: true,
        role: ROLES.INSTRUCTOR,
      },
      UserSelects.INSTRUCTOR.basic
    );

    return [...assignedInstructors, ...notAssignedInstructors];
  }

  @Get("students")
  @UseGuards(InstructorGuard)
  async getStudentsOfInstructor(
    @Query() { instructor }: { instructor: string }
  ) {
    const assignedStudentIds = await this.userService.getStudentsOfInstructor(
      instructor
    );

    const assignedStudents = await this.userService.find(
      { _id: { $in: assignedStudentIds }, isActive: true, role: ROLES.STUDENT },
      UserSelects.INSTRUCTOR.basic
    );

    for (let i = 0; i < assignedStudents.length; i++) {
      assignedStudents[i].assigned = true;
    }

    const notAssignedStudents = await this.userService.find(
      {
        _id: { $nin: assignedStudentIds },
        isActive: true,
        role: ROLES.STUDENT,
      },
      UserSelects.STUDENT.basic
    );

    return [...assignedStudents, ...notAssignedStudents];
  }

  @Post("instructor")
  async createInstructor(@Body() user: RegisterDtoInstructor) {
    try {
      const userExist = await this.userService.exists({
        phone: user.phone,
        isActive: true,
      });

      if (userExist) {
        throw new ExceptionAlreadyExist(USER_ALREADY_EXIST);
      }

      const createdUser = await this.userService.create({
        ...user,
        role: ROLES.INSTRUCTOR,
      });

      const token = this.authService.generateUserToken(createdUser);
      return { user: createdUser, token };
    } catch (error) {
      throw error;
    }
  }

  @Post("student")
  @UseGuards(InstructorGuard)
  async createStudent(
    @User("_id") instructorId: string,
    @Body() user: RegisterDtoStudent
  ) {
    try {
      const userExist = await this.userService.exists({
        nickname: user.nickname,
        isActive: true,
      });

      if (userExist) throw new ExceptionAlreadyExist(USER_ALREADY_EXIST);

      const createdUser = await this.userService.findOneAndUpdate({
        user: {
          ...user,
          passwordInit: true,
          creator: instructorId,
        },
        update: {},
        getNew: true,
      });

      await this.userService.createRelation({
        instructorId,
        studentId: createdUser._id,
      });

      return { createdUser };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get("dashboard")
  @UseGuards(UserGuard)
  async dashboard(@User("_id") instructorId: string) {
    return await this.userService.getDashboard(instructorId);
  }

  @Get(":_id")
  async detail(@IdParam("_id") userId: string) {
    return await this.userService.detail(userId);
  }

  @Get(":_id/confirm-instructor")
  async confirm(@IdParam("_id") instructorId: string) {
    const confirmed = Boolean(await this.userService.confirm(instructorId));

    return { confirmed };
  }

  @Get(":_id/cancel-confirmation")
  async cancel(@IdParam("_id") instructorId: string) {
    const canceled = Boolean(await this.userService.cancel(instructorId));

    return { canceled };
  }

  @Delete("student/:_id")
  @UseGuards(InstructorGuard)
  async delete(
    @User("_id") instructorId: string,
    @IdParam() studentId: string
  ) {
    try {
      const isInstructorAuthorized =
        await this.userService.checkInstructorAuthOnStudent(
          instructorId,
          studentId
        );

      if (!isInstructorAuthorized) {
        throw new ExceptionBadRequest(UNAUTHORIZED_REQUEST);
      }

      await this.userService.delete(studentId, instructorId);

      await this.quizStudentService.deleteStudent(studentId, instructorId);
    } catch (error) {
      throw new ExceptionBadRequest(error);
    }
  }

  @Delete("student/:_id/delete-for-all")
  @UseGuards(AdminGuard)
  async deleteForAll(@IdParam() studentId: string) {
    try {
      await this.userService.deleteForAll(studentId);

      await this.quizStudentService.deleteStudentForAll(studentId);
    } catch (error) {
      throw new ExceptionBadRequest(SOMETHING_WENT_WRONG);
    }
  }

  @Put("student")
  @UseGuards(UserGuard)
  async update(
    @User("_id") instructorId: string,
    @Body() studentDto: UpdateStudentDto
  ) {
    const isInstructorAuthorized =
      await this.userService.checkInstructorAuthOnStudent(
        instructorId,
        studentDto._id
      );

    if (!isInstructorAuthorized) {
      throw new ExceptionBadRequest(UNAUTHORIZED_REQUEST);
    }

    const foundStudent = await this.userService.findOneByNickName(
      studentDto.nickname,
      studentDto._id
    );

    if (foundStudent) throw new ExceptionBadRequest(STUDENT_ALREADY_EXIST);
    const { _id, ...student } = studentDto;
    await this.userService.findOneAndUpdate({
      user: { _id, creator: instructorId },
      update: student,
      upsert: false,
    });
  }
}
