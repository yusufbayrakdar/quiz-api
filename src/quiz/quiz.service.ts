import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { QuizStudent } from "src/quiz-student/entities/quiz-student.entity";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { Quiz } from "./entities/quiz.entity";

@Injectable()
export class QuizService {
  constructor(
    @InjectModel("Quiz") private quizModel: Model<Quiz>,
    @InjectModel("QuizStudent") private quizStudentModel: Model<QuizStudent>
  ) {}

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
          path: "creator",
          select: "fullName",
        },
      ])
      .lean();
  }

  getQuizList(questionId: string) {
    return this.quizModel.find({ questionList: questionId }).distinct("_id");
  }

  async paginate(query, showStudentCount) {
    await this.quizModel.updateMany({}, { $unset: { assignedStudents: "" } });

    if (query.student) {
      const assignedQuizzes = await this.quizStudentModel
        .find({ student: query.student, isActive: true })
        .distinct("quiz");
      query._id = { $in: assignedQuizzes };
    }

    const result = await paginationHelper({
      Model: this.quizModel,
      query,
      filterableFields: ["_id", "name", "duration", "creator"],
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
          select: "fullName",
        },
      ],
    });

    if (showStudentCount) {
      for (let i = 0; i < result.docs.length; i++) {
        const quiz = result.docs[i];
        quiz.studentCount = await this.quizStudentModel.count({
          quiz: quiz._id,
          isActive: true,
        });
      }
    }

    return result;
  }

  delete({ _id, creator }: { _id: string; creator: string }) {
    return this.quizStudentModel.updateMany(
      { student: _id, instructor: creator },
      { isActive: false }
    );
  }
}
