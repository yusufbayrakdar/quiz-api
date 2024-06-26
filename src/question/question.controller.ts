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
import { InstructorGuard } from "src/utilities/guards/instructor.guard";
import { AdminGuard } from "src/utilities/guards/admin.guard";
import ROLES from "src/utilities/roles";

@Controller("questions")
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly searchService: SearchService
  ) {}
  checkShapesForm = (questionData) => {
    for (let i = 0; i < questionData.question.length; i++) {
      const shapeInfo = questionData.question[i];
      if (!shapeInfo.shape || !shapeInfo.coordinate) {
        throw new ExceptionBadRequest(SOMETHING_WENT_WRONG);
      }
    }
  };

  @UseGuards(InstructorGuard)
  @Post()
  async create(@Body() question: QuestionDto, @User("_id") creator: string) {
    this.checkShapesForm(question);

    const createdQuestion: any = await this.questionService.create({
      ...question,
      creator,
    });
    return this.searchService.syncSearches({ _id: createdQuestion?._id });
  }

  @UseGuards(InstructorGuard)
  @Put()
  async update(@Body() question: UpdateQuestionDto, @User() editor) {
    const { _id, ...update } = question;
    const isCreator = await this.questionService.exist({
      _id,
      creator: editor._id,
    });
    const isAdmin = editor.role === ROLES.ADMIN;
    if (!isCreator && !isAdmin) {
      throw new ExceptionForbidden(UNAUTHORIZED_QUESTION_EDIT);
    }

    this.checkShapesForm(question);
    await this.questionService.findByIdAndUpdate(_id, update);
    return this.searchService.syncSearches({ _id });
  }

  @UseGuards(InstructorGuard)
  @Delete(":_id")
  async delete(@IdParam() _id: string, @User() deletor) {
    const isCreator = await this.questionService.exist({
      _id,
      creator: deletor._id,
    });
    const isAdmin = deletor.role === ROLES.ADMIN;
    if (!isCreator && !isAdmin) throw new ExceptionForbidden();

    await this.questionService.delete(_id);
    await this.searchService.delete(_id);
  }

  @UseGuards(AdminGuard)
  @Post("create-duration")
  async createDuration(@Body() { duration }: DurationDto) {
    return this.questionService.createDuration(duration);
  }

  @UseGuards(AdminGuard)
  @Post("create-category")
  async createCategory(@Body() { category }: CategoryDto) {
    return this.questionService.createCategory(category);
  }

  @UseGuards(AdminGuard)
  @Post("create-grade")
  async createGrade(@Body() { grade }: GradeDto) {
    return this.questionService.createGrade(grade);
  }

  @UseGuards(UserGuard)
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

  @UseGuards(AdminGuard)
  @Get("activate-duration/:_id")
  async activateDuration(@IdParam() _id: string) {
    await this.questionService.setDurationStatus(_id, true);
  }

  @UseGuards(AdminGuard)
  @Get("deactivate-duration/:_id")
  async deactivateDuration(@IdParam() _id: string) {
    await this.questionService.setDurationStatus(_id, false);
  }

  @UseGuards(AdminGuard)
  @Get("activate-category/:_id")
  async activateCategory(@IdParam() _id: string) {
    await this.questionService.setCategoryStatus(_id, true);
  }

  @UseGuards(AdminGuard)
  @Get("deactivate-category/:_id")
  async deactivateCategory(@IdParam() _id: string) {
    await this.questionService.setCategoryStatus(_id, false);
  }

  @UseGuards(AdminGuard)
  @Get("activate-grade/:_id")
  async activateGrade(@IdParam() _id: string) {
    await this.questionService.setGradeStatus(_id, true);
  }

  @UseGuards(AdminGuard)
  @Get("deactivate-grade/:_id")
  async deactivateGrade(@IdParam() _id: string) {
    await this.questionService.setGradeStatus(_id, false);
  }
}
