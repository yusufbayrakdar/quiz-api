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

import { ScoreDto } from "src/score/dto/score.dto";
import { SearchService } from "src/search/search.service";
import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { User } from "src/utilities/decorators/user.decorator";
import { QUIZ_NOT_FOUND, SOMETHING_WENT_WRONG } from "src/utilities/errors";
import {
  ExceptionBadRequest,
  ExceptionForbidden,
} from "src/utilities/exceptions";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { QuizDto } from "./dto/quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QuizService } from "./quiz.service";
import { ScoreService } from "../score/score.service";
import { QuestionService } from "src/question/question.service";
import { AssignQuizDto } from "./dto/assign-quiz.dto";
import { QuizStudentService } from "src/quiz-student/quiz-student.service";
import { UserService } from "src/user/user.service";
import { UserSelects } from "src/user/entities/user.entity";
import { InstructorGuard } from "src/utilities/guards/instructor.guard";
import { StudentGuard } from "src/utilities/guards/student.guard";
import { AdminGuard } from "src/utilities/guards/admin.guard";
import ROLES from "src/utilities/roles";

@Controller("quizzes")
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly searchService: SearchService,
    private readonly questionService: QuestionService,
    private readonly scoreService: ScoreService,
    private readonly quizStudentService: QuizStudentService,
    private readonly userService: UserService
  ) {}

  @UseGuards(UserGuard)
  @Get()
  async paginate(
    @Query() query: PaginationQueryDto,
    @User("_id") user: string
  ) {
    const isStudent = await this.userService.exists({
      _id: user,
      role: ROLES.STUDENT,
    });
    const filter = isStudent ? { student: user } : {};
    return await this.quizService.paginate({ ...query, ...filter }, !isStudent);
  }

  @UseGuards(UserGuard)
  @Get(":_id")
  async detail(
    @IdParam() _id: string,
    @Query() query: PaginationQueryDto,
    @User("_id") user: string
  ) {
    let quiz: any = await this.quizService.detail(_id);
    const { role } = await this.userService.findOne(
      {
        _id: user,
      },
      "role"
    );
    const canSeeResults = role === ROLES.ADMIN || role === ROLES.INSTRUCTOR;
    if (query.populateQuestions) {
      const questionList = await this.searchService.paginate({
        ...query,
        _id: { $in: quiz?.questionList },
      });
      quiz = { ...quiz, questionList };
    }
    if (query.results && canSeeResults) {
      // the hardest question may shown
      const scores: any = await this.scoreService.findByQuiz(_id);
      for (let i = 0; i < scores.length; i++) {
        const student = scores[i]?.student;
        const hasInstructorAuthOnStudent =
          await this.userService.checkInstructorAuthOnStudent(
            user,
            student?._id
          );
        if (hasInstructorAuthOnStudent || role === ROLES.ADMIN) continue;
        delete student.fullName;
        delete student.nickName;
      }
      const completedStudents = await this.scoreService.completedCount(_id);

      let finishedAtTotal = 0;
      let scoreTotal = 0;

      scores.forEach((scoreInfo) => {
        finishedAtTotal += scoreInfo.finishedAt;
        scoreTotal += scoreInfo.score;
      });

      const general = {
        finishedAtAvg: Number((finishedAtTotal / scores.length)?.toFixed(2)),
        scoreAvg: Number((scoreTotal / scores.length)?.toFixed(2)),
        completedStudents: completedStudents?.length,
      };

      const studentCount = await this.quizStudentService.count({
        quiz: quiz._id,
        isActive: true,
      });

      quiz = { ...quiz, general, scores, studentCount };
    }
    return quiz;
  }

  @UseGuards(InstructorGuard)
  @Delete(":_id")
  async delete(@IdParam() _id: string, @User() editor) {
    try {
      const isCreator = await this.quizService.exist({
        _id,
        creator: editor._id,
      });
      const isAdmin = editor.role === ROLES.ADMIN;
      if (!isCreator && !isAdmin) throw new ExceptionForbidden();

      await this.quizService.delete(_id);
    } catch (error) {
      throw new ExceptionForbidden();
    }
  }

  @UseGuards(InstructorGuard)
  @Post()
  async create(@Body() quiz: QuizDto, @User("_id") creator: string) {
    const createdQuiz: any = await this.quizService.create({
      ...quiz,
      creator,
    });

    return this.searchService.syncSearches({
      _id: { $in: createdQuiz?.questionList },
    });
  }

  @UseGuards(StudentGuard)
  @Post("finish")
  async finish(@Body() quizFinishInfo: ScoreDto, @User("_id") student: string) {
    const quiz = await this.quizService.findById(
      quizFinishInfo.quiz,
      "questionList"
    );
    const totalQuestions = quiz?.questionList?.length;
    if (!totalQuestions) throw new ExceptionBadRequest(QUIZ_NOT_FOUND);

    const questionIds = quizFinishInfo.answerList.map(
      (answer) => answer.questionId
    );
    const questionList: any = await this.questionService.find(
      { _id: { $in: questionIds } },
      "correctAnswer"
    );

    const score = quizFinishInfo.answerList.reduce((total, answerInfo) => {
      if (
        String(
          questionList.find(
            (question) => question._id.toString() === answerInfo.questionId
          )?.correctAnswer
        ) === String(answerInfo.answer)
      ) {
        total++;
      }
      return total;
    }, 0);
    return await this.scoreService.create({
      student,
      score,
      totalQuestions,
      quiz: quizFinishInfo.quiz,
      finishedAt: quizFinishInfo.finishedAt,
    });
  }

  @UseGuards(InstructorGuard)
  @Put()
  async update(@Body() quiz: UpdateQuizDto, @User() editor) {
    const { _id, ...update } = quiz;
    const isCreator = await this.quizService.exist({
      _id,
      creator: editor._id,
    });
    const isAdmin = editor.role === ROLES.ADMIN;
    if (!isCreator && !isAdmin) throw new ExceptionForbidden();

    const createdQuiz: any = await this.quizService.findByIdAndUpdate(
      _id,
      update
    );

    return this.searchService.syncSearches({
      _id: { $in: createdQuiz?.questionList },
    });
  }

  @UseGuards(InstructorGuard)
  @Post(":_id/assign")
  async assign(
    @IdParam() quiz: string,
    @Body() { students }: AssignQuizDto,
    @User("_id") instructor: string
  ) {
    const studentIdsOfInstructor =
      await this.userService.studentIdsOfInstructor({
        instructor,
        student: { $in: students },
      });

    for (let i = 0; i < studentIdsOfInstructor.length; i++) {
      await this.quizStudentService.findOneAndUpdate(
        {
          instructor,
          quiz,
          student: studentIdsOfInstructor[i],
          isActive: true,
        },
        {}
      );
    }

    await this.quizStudentService.updateMany(
      { instructor, quiz, student: { $nin: studentIdsOfInstructor } },
      { isActive: false }
    );
  }

  @UseGuards(AdminGuard)
  @Post(":_id/assign-by-admin")
  async assignAdmin(
    @IdParam() quiz: string,
    @Body() { students }: AssignQuizDto,
    @User("_id") instructor: string
  ) {
    const studentIdsOfInstructor =
      await this.userService.studentIdsOfInstructor({
        student: { $in: students },
      });

    for (let i = 0; i < studentIdsOfInstructor.length; i++) {
      await this.quizStudentService.findOneAndUpdate(
        {
          instructor,
          quiz,
          student: studentIdsOfInstructor[i],
          isActive: true,
        },
        {}
      );
    }

    await this.quizStudentService.updateMany(
      { quiz, student: { $nin: studentIdsOfInstructor } },
      { isActive: false }
    );
  }

  @UseGuards(InstructorGuard)
  @Get(":_id/students")
  async students(@IdParam() quiz: string, @User("_id") instructor: string) {
    const quizStudents = await this.quizStudentService.listStudentIds({
      instructor,
      quiz,
      isActive: true,
    });

    const students: Array<any> = await this.userService.list(
      {
        _id: { $in: quizStudents },
        isActive: true,
      },
      UserSelects.STUDENT.basic
    );
    for (let i = 0; i < students.length; i++) {
      students[i].assigned = true;
    }

    const notAssignedStudentIds: Array<any> =
      await this.userService.studentIdsOfInstructor({
        student: { $nin: quizStudents },
        instructor,
        isActive: true,
      });

    const notAssignedStudents = await this.userService.list(
      {
        _id: { $in: notAssignedStudentIds },
      },
      UserSelects.STUDENT.basic
    );
    students.push(...notAssignedStudents);

    return students;
  }
}
