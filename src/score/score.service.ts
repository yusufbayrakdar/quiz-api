import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { Score, ScorePopulates } from "./entities/score.entity";

@Injectable()
export class ScoreService {
  constructor(@InjectModel("Score") private scoreModel: Model<Score>) {}

  create(score) {
    return this.scoreModel.create(score);
  }

  findOneAndUpdate(filter, payload) {
    return this.scoreModel.findOneAndUpdate(filter, payload, {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    });
  }

  detail(_id, student) {
    return this.scoreModel
      .findOne({ _id, student })
      .populate(ScorePopulates)
      .lean();
  }

  findByStudent(student: string, quiz?: string) {
    const quizQuery = quiz ? { quiz: quiz } : {};
    return this.scoreModel
      .find({ student, ...quizQuery })
      .populate(ScorePopulates)
      .lean();
  }

  findByQuiz(quiz: any) {
    return this.scoreModel.find({ quiz }).populate("student").lean();
  }

  completedCount(quiz: any) {
    return this.scoreModel.countDocuments({ quiz }).distinct("student");
  }

  paginate(query, select?: string) {
    return paginationHelper({
      Model: this.scoreModel,
      query,
      filterableFields: ["_id", "student", "quiz", "score"],
      defaultLimit: 20,
      populate: ScorePopulates,
      select,
    });
  }
}
