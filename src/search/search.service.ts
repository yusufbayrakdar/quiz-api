import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionService } from "src/question/question.service";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { Search, SearchSelects } from "./entities/search.entity";

@Injectable()
export class SearchService {
  constructor(
    @InjectModel("Search") private searchModel: Model<Search>,
    private readonly questionService: QuestionService
  ) {}

  paginate(query) {
    return paginationHelper({
      Model: this.searchModel,
      query: { ...query, isActive: true },
      filterableFields: ["_id", "duration", "grade", "category"],
      searchableFields: ["creator"],
      defaultLimit: 10,
      select: SearchSelects.basic,
    });
  }

  async syncSearches(questionId: string) {
    const question: any = await this.questionService.getPopulatedQuestionById(
      questionId
    );

    this.searchModel
      .findByIdAndUpdate(questionId, question, {
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }
}
