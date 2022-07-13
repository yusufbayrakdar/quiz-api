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

import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { StudentService } from "./student.service";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { StudentDto } from "./dto/student.dto";
import { ExceptionBadRequest } from "src/utilities/exceptions";
import {
  INSTRUCTOR_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
  STUDENT_ALREADY_EXIST,
  UNAUTHORIZED_INSTRUCTOR_REQUEST,
} from "src/utilities/errors";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { InstructorService } from "src/instructor/instructor.service";
import { QuizService } from "src/quiz/quiz.service";
import { ScoreService } from "src/score/score.service";

@Controller("students")
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly instructorService: InstructorService,
    private readonly quizService: QuizService,
    private readonly scoreService: ScoreService
  ) {}

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
    const foundInstructor = await this.instructorService.exists({
      _id: instructorId,
    });

    if (foundStudent) throw new ExceptionBadRequest(STUDENT_ALREADY_EXIST);
    if (!foundInstructor) {
      throw new ExceptionBadRequest(INSTRUCTOR_DOES_NOT_EXIST);
    }

    const createdStudent = await this.studentService.findOneAndUpdate({
      student: { ...studentDto, passwordInit: true, creator: instructorId },
      update: {},
      getNew: true,
    });
    const studentId = createdStudent?._id;
    if (studentId) {
      await this.studentService.createRelation({
        instructorId,
        studentId,
      });
    }
  }

  @Put()
  @UseGuards(UserGuard)
  async update(
    @User("_id") instructorId: string,
    @Body() studentDto: UpdateStudentDto
  ) {
    const isInstructorAuthorized =
      await this.studentService.checkInstructorAuthForStudent(
        instructorId,
        studentDto._id
      );

    if (!isInstructorAuthorized) {
      throw new ExceptionBadRequest(UNAUTHORIZED_INSTRUCTOR_REQUEST);
    }

    const foundStudent = await this.studentService.findOneByNickName(
      studentDto.nickname,
      studentDto._id
    );

    if (foundStudent) throw new ExceptionBadRequest(STUDENT_ALREADY_EXIST);
    const { _id, ...student } = studentDto;
    await this.studentService.findOneAndUpdate({
      student: { _id, creator: instructorId },
      update: student,
      upsert: false,
    });
  }

  @Delete(":_id")
  @UseGuards(UserGuard)
  async delete(
    @User("_id") instructorId: string,
    @IdParam() studentId: string
  ) {
    try {
      const isInstructorAuthorized =
        await this.studentService.checkInstructorAuthForStudent(
          instructorId,
          studentId
        );

      if (!isInstructorAuthorized) {
        throw new ExceptionBadRequest(UNAUTHORIZED_INSTRUCTOR_REQUEST);
      }

      await this.studentService.delete(studentId);

      const includedQuizzes = await this.quizService.findByStudentId(studentId);
      for (const quiz of includedQuizzes) {
        await this.quizService.findOneAndUpdate(
          { _id: quiz?._id },
          {
            assignedStudents: quiz?.assignedStudents?.filter(
              (sId) => String(sId) !== String(studentId)
            ),
          }
        );
      }
    } catch (error) {
      throw new ExceptionBadRequest(SOMETHING_WENT_WRONG);
    }
  }

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") studentId: string) {
    return await this.studentService.getProfile(studentId);
  }

  @Get(":_id")
  @UseGuards(UserGuard)
  async detail(
    @User("_id") instructorId: string,
    @IdParam() studentId: string,
    @Query() query: PaginationQueryDto
  ) {
    const isInstructorAuthorized =
      await this.studentService.checkInstructorAuthForStudent(
        instructorId,
        studentId
      );

    if (!isInstructorAuthorized) {
      throw new ExceptionBadRequest(UNAUTHORIZED_INSTRUCTOR_REQUEST);
    }

    const student = await this.studentService.getProfile(studentId);
    const scores = await this.scoreService.paginate({
      ...query,
      student: studentId,
    });
    return { ...student, scores };
  }
}
