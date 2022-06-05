import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";

import { Quiz } from "./entities/quiz.entity";

@Injectable()
export class QuizService {
  constructor(@InjectModel("Quiz") private quizModel: Model<Quiz>) {}

  create(quiz) {
    return this.quizModel.findOneAndUpdate(
      quiz,
      {},
      { upsert: true, setDefaultsOnInsert: true, new: true }
    );
  }

  findById(_id: string, select?: string) {
    return this.quizModel.findById(_id).select(select).lean();
  }

  findOneAndUpdate(filter, payload) {
    return this.quizModel.findOneAndUpdate(filter, payload, {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    });
  }

  detail(_id) {
    return this.quizModel
      .findById(_id)
      .populate([
        {
          path: "assignedStudents",
          select: "firstName lastName",
        },
        {
          path: "creator",
          select: "firstName lastName",
        },
      ])
      .lean();
  }

  getQuizList(questionId: string) {
    return this.quizModel.find({ questionList: questionId }).distinct("_id");
  }

  paginate(query) {
    return paginationHelper({
      Model: this.quizModel,
      query: { ...query, isActive: true },
      filterableFields: [
        "_id",
        "name",
        "duration",
        "creator",
        "assignedStudents",
      ],
      searchableFields: ["name"],
      defaultLimit: 10,
      populate: [
        {
          path: "questionList",
          select: "question choices duration",
          populate: [
            {
              path: "question.shape",
              select: "imageUrl",
            },
            {
              path: "choices.shape",
              select: "imageUrl",
            },
            {
              path: "duration",
              select: "duration",
            },
          ],
        },
        {
          path: "creator",
          select: "firstName lastName",
        },
      ],
    });
  }

  findByStudentId(studentId: string) {
    return this.quizModel.find({ assignedStudents: studentId }).lean();
  }

  delete(query: { _id: string; creator: string }) {
    return this.quizModel.findOneAndDelete(query);
  }
}
