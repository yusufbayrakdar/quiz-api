import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
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

@Controller("questions")
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly searchService: SearchService
  ) {}
  @UseGuards(UserGuard)
  @Post()
  async create(@Body() question: QuestionDto, @User("_id") creator: string) {
    const createdQuestion: any = await this.questionService.create({
      ...question,
      creator,
    });
    return this.searchService.syncSearches(createdQuestion?._id);
  }

  @UseGuards(UserGuard)
  @Put()
  async update(
    @Body() question: UpdateQuestionDto,
    @User("_id") creator: string
  ) {
    const { _id, ...update } = question;
    await this.questionService.update({ _id, creator }, update);
    return this.searchService.syncSearches(question._id);
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
  async configs() {
    const [categories, durations, grades] = await Promise.all([
      this.questionService.getCategories(),
      this.questionService.getDurations(),
      this.questionService.getGrades(),
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
