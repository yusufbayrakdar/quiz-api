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
import {
  INSTRUCTOR_DOES_NOT_EXIST,
  QUIZ_NOT_FOUND,
  SOMETHING_WENT_WRONG,
} from "src/utilities/errors";
import { ExceptionBadRequest } from "src/utilities/exceptions";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { QuizDto } from "./dto/quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QuizService } from "./quiz.service";
import { ScoreService } from "../score/score.service";
import { QuestionService } from "src/question/question.service";

@Controller("quizzes")
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly searchService: SearchService,
    private readonly questionService: QuestionService,
    private readonly scoreService: ScoreService
  ) {}

  @Get()
  async paginate(@Query() query: PaginationQueryDto) {
    return await this.quizService.paginate(query);
  }

  @Get(":_id")
  async detail(@IdParam() _id: string, @Query() query: PaginationQueryDto) {
    const quiz: any = await this.quizService.detail(_id);
    if (query.populateQuestions) {
      const questionList = await this.searchService.paginate({
        ...query,
        _id: { $in: quiz?.questionList },
      });
      return { ...quiz, questionList };
    } else return quiz;
  }

  @UseGuards(UserGuard)
  @Delete(":_id")
  async delete(@IdParam() _id: string, @User("_id") creator: string) {
    try {
      await this.quizService.delete({ _id, creator });
    } catch (error) {
      throw new ExceptionBadRequest(SOMETHING_WENT_WRONG);
    }
  }

  @UseGuards(UserGuard)
  @Post()
  async create(@Body() quiz: QuizDto, @User("_id") creator: string) {
    if (!creator) throw new ExceptionBadRequest(INSTRUCTOR_DOES_NOT_EXIST);

    const createdQuiz: any = await this.quizService.create({
      ...quiz,
      creator,
    });

    return this.searchService.syncSearches({
      _id: { $in: createdQuiz?.questionList },
    });
  }

  @UseGuards(UserGuard)
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

  @UseGuards(UserGuard)
  @Put()
  async update(@Body() quiz: UpdateQuizDto, @User("_id") creator: string) {
    if (!creator) throw new ExceptionBadRequest(INSTRUCTOR_DOES_NOT_EXIST);

    const filter = { _id: quiz._id, creator };
    const payload = { ...quiz };
    delete payload._id;
    const createdQuiz: any = await this.quizService.findOneAndUpdate(
      filter,
      payload
    );

    return this.searchService.syncSearches({
      _id: { $in: createdQuiz?.questionList },
    });
  }
}
