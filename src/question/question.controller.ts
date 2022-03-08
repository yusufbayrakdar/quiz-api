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
import { UserGuard } from "src/utilities/guards/user.guard";
import { CategoryDto } from "./dto/category.dto";
import { DurationDto } from "./dto/duration.dto";
import { GradeDto } from "./dto/grade.dto";
import { QuestionDto } from "./dto/question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { QuestionService } from "./question.service";
import {
  ExceptionBadRequest,
  ExceptionForbidden,
} from "../utilities/exceptions";
import {
  SOMETHING_WENT_WRONG,
  UNAUTHORIZED_QUESTION_EDIT,
} from "src/utilities/errors";

@Controller("questions")
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly searchService: SearchService
  ) {}
  checkShapesForm = (questionData) => {
    for (const shapeInfo of questionData.question) {
      if (!shapeInfo.shape || !shapeInfo.coordinate) {
        throw new ExceptionBadRequest(SOMETHING_WENT_WRONG);
      }
    }
  };

  @UseGuards(UserGuard)
  @Post()
  async create(@Body() question: QuestionDto, @User("_id") creator: string) {
    this.checkShapesForm(question);

    const createdQuestion: any = await this.questionService.create({
      ...question,
      creator,
    });
    return this.searchService.syncSearches({ _id: createdQuestion?._id });
  }

  @UseGuards(UserGuard)
  @Put()
  async update(
    @Body() question: UpdateQuestionDto,
    @User("_id") creator: string
  ) {
    const { _id, ...update } = question;
    const questionCurrentState = await this.questionService.findById(_id);
    if (String(questionCurrentState.creator) !== creator) {
      throw new ExceptionForbidden(UNAUTHORIZED_QUESTION_EDIT);
    }
    this.checkShapesForm(question);

    await this.questionService.update({ _id, creator }, update);
    return this.searchService.syncSearches({ _id: question._id });
  }

  @Delete(":_id")
  async delete(@IdParam() _id: string) {
    await this.questionService.delete(_id);
    await this.searchService.delete(_id);
  }

  @Post("create-duration")
  async createDuration(@Body() { duration }: DurationDto) {
    return this.questionService.createDuration(duration);
  }

  @Post("create-category")
  async createCategory(@Body() { category }: CategoryDto) {
    return this.questionService.createCategory(category);
  }

  @Post("create-grade")
  async createGrade(@Body() { grade }: GradeDto) {
    return this.questionService.createGrade(grade);
  }

  @Get("configs")
  async configs(@Query("all") all: string) {
    const isActiveFilter = all === "true" ? {} : { isActive: true };
    const [categories, durations, grades] = await Promise.all([
      this.questionService.getCategories(isActiveFilter),
      this.questionService.getDurations(isActiveFilter),
      this.questionService.getGrades(isActiveFilter),
    ]);
    return { categories, durations, grades };
  }

  @Get("activate-duration/:_id")
  async activateDuration(@IdParam() _id: string) {
    await this.questionService.setDurationStatus(_id, true);
  }

  @Get("deactivate-duration/:_id")
  async deactivateDuration(@IdParam() _id: string) {
    await this.questionService.setDurationStatus(_id, false);
  }

  @Get("activate-category/:_id")
  async activateCategory(@IdParam() _id: string) {
    await this.questionService.setCategoryStatus(_id, true);
  }

  @Get("deactivate-category/:_id")
  async deactivateCategory(@IdParam() _id: string) {
    await this.questionService.setCategoryStatus(_id, false);
  }

  @Get("activate-grade/:_id")
  async activateGrade(@IdParam() _id: string) {
    await this.questionService.setGradeStatus(_id, true);
  }

  @Get("deactivate-grade/:_id")
  async deactivateGrade(@IdParam() _id: string) {
    await this.questionService.setGradeStatus(_id, false);
  }
}
