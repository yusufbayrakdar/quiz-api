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
    const hasAnyFilter = Object.keys(filter).length > 0;

    let startNumber = 1;
    if (hasAnyFilter) {
      const lastSyncSearch: any = await this.searchModel
        .findOne()
        .sort({ createdAt: -1 });
      startNumber = lastSyncSearch?.questionNumber + 1;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const quizList = await this.quizService.getQuizList(question._id);
      const search = await this.searchModel
        .findById(question._id)
        .select("questionNumber");
      await this.searchModel.findByIdAndUpdate(
        question._id,
        {
          ...question,
          quizList,
          questionNumber: search?.questionNumber || startNumber + i,
        },
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
