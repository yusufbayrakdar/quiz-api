import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SearchService } from "src/search/search.service";
import { IdParam } from "src/utilities/decorators/paramId.decorator";

import { User } from "src/utilities/decorators/user.decorator";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { QuizDto } from "./dto/quiz.dto";
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
  async detail(@IdParam() _id: string) {
    return await this.quizService.detail(_id);
  }

  @UseGuards(UserGuard)
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

  @UseGuards(UserGuard)
  @Put()
  async update(@Body() quiz: QuizDto, @User("_id") creator: string) {
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
