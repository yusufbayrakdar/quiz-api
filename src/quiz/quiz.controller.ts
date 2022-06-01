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

import { SearchService } from "src/search/search.service";
import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { User } from "src/utilities/decorators/user.decorator";
import {
  INSTRUCTOR_DOES_NOT_EXIST,
  SOMETHING_WENT_WRONG,
} from "src/utilities/errors";
import { ExceptionBadRequest } from "src/utilities/exceptions";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { QuizDto } from "./dto/quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QuizService } from "./quiz.service";

@Controller("quizzes")
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly searchService: SearchService
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
