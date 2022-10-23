import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { QuizStudent } from "./entities/quiz-student.entity";
import { User, UserSelects } from "src/user/entities/user.entity";

@Injectable()
export class QuizStudentService {
  constructor(
    @InjectModel("User") private userModel: Model<User>,
    @InjectModel("QuizStudent")
    private quizStudentModel: Model<QuizStudent>
  ) {}

  async listStudentIds(query) {
    return this.quizStudentModel.find(query).distinct("student");
  }

  async updateMany(filter, payload) {
    await this.quizStudentModel.updateMany(filter, payload);
  }

  async count(filter) {
    return this.quizStudentModel.count(filter);
  }

  async findOneAndUpdate(filter, payload) {
    await this.quizStudentModel.findOneAndUpdate(filter, payload, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
  }

  async studentsOfQuiz(query) {
    const studentIds = await this.quizStudentModel
      .find({ quiz: query.quiz, isActive: true })
      .distinct("student");

    query._id = { $in: studentIds };

    const { hasPhone } = query;
    const customFilters: any = {};
    if (hasPhone === "true") {
      customFilters.phone = { $ne: null };
    } else if (hasPhone === "false") {
      customFilters.phone = null;
    }

    return paginationHelper({
      Model: this.userModel,
      query,
      customFilters,
      searchableFields: ["fullName", "nickname", "phone"],
      filterableFields: ["_id"],
      select: UserSelects.STUDENT.basic,
    });
  }

  async deleteStudent(student, instructor) {
    await this.quizStudentModel.updateMany(
      { student, instructor },
      { isActive: false }
    );
  }

  async deleteStudentForAll(student) {
    await this.quizStudentModel.updateMany({ student }, { isActive: false });
  }
}
