import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionService } from "src/question/question.service";
import { QuizService } from "src/quiz/quiz.service";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { Search, SearchSelects } from "./entities/search.entity";

@Injectable()
export class SearchService {
  constructor(
    @InjectModel("Search") private searchModel: Model<Search>,
    private readonly questionService: QuestionService,
    private readonly quizService: QuizService
  ) {}

  paginate(query) {
    return paginationHelper({
      Model: this.searchModel,
      query: { ...query, isActive: true },
      filterableFields: ["_id", "duration", "grade", "category", "creatorId"],
      searchableFields: ["creatorName"],
      defaultLimit: 10,
      select: SearchSelects.basic,
    });
  }

  detail(_id) {
    return this.searchModel.findById(_id);
  }

  async syncSearches(filter: object = {}) {
    const questions: any = await this.questionService.getPopulatedQuestions(
      filter
    );

    for (const question of questions) {
      const quizList = await this.quizService.getQuizList(question._id);
      await this.searchModel.findByIdAndUpdate(
        question._id,
        { ...question, quizList },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );
    }
  }

  async delete(questionId: string) {
    await this.searchModel.findByIdAndDelete(questionId);
  }
}
