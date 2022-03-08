import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Category } from "./entities/category.entity";
import { Duration } from "./entities/duration.entity";
import { Grade } from "./entities/grade.entity";
import { Question } from "./entities/question.entity";

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel("Question") private questionModel: Model<Question>,
    @InjectModel("Duration") private durationModel: Model<Duration>,
    @InjectModel("Category") private categoryModel: Model<Category>,
    @InjectModel("Grade") private gradeModel: Model<Grade>
  ) {}

  findById(id: string) {
    return this.questionModel.findById(id);
  }

  getPopulatedQuestions(filter: object = {}) {
    return this.questionModel
      .find(filter)
      .populate([
        {
          model: "Shape",
          path: "question.shape",
          select: "imageUrl",
        },
        {
          model: "Shape",
          path: "choices.shape",
          select: "imageUrl",
        },
        {
          model: "Category",
          path: "category",
          select: "category",
        },
        {
          model: "Instructor",
          path: "creator",
          select: "firstName lastName phone",
        },
        {
          model: "Duration",
          path: "duration",
          select: "duration",
        },
        {
          model: "Grade",
          path: "grade",
          select: "grade",
        },
      ])
      .lean()
      .then((questions: any) => {
        const prepared = questions.reduce((acc, question) => {
          acc.push({
            ...question,
            category: question.category.category,
            duration: question.duration.duration,
            grade: question.grade.grade,
            creator: {
              name: `${question.creator.firstName} ${question.creator.lastName}`,
              _id: question.creator._id,
            },
          });
          return acc;
        }, []);
        return prepared;
      });
  }

  create(question) {
    return this.questionModel.findOneAndUpdate(
      question,
      {},
      { upsert: true, setDefaultsOnInsert: true, new: true }
    );
  }

  update(filter: object, update: object) {
    return this.questionModel.findOneAndUpdate(filter, update);
  }

  delete(question) {
    return this.questionModel.findByIdAndDelete(question);
  }

  createDuration(duration: number) {
    return this.durationModel.findOneAndUpdate(
      { duration },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  getDurations(query: object) {
    return this.durationModel
      .find(query)
      .select("isActive duration")
      .sort({ duration: 1 });
  }

  createCategory(category: string) {
    return this.categoryModel.findOneAndUpdate(
      { category },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  getCategories(query: object) {
    return this.categoryModel
      .find(query)
      .select("isActive category")
      .sort({ category: 1 });
  }

  createGrade(grade: string) {
    return this.gradeModel.findOneAndUpdate(
      { grade },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  getGrades(query: object) {
    return this.gradeModel
      .find(query)
      .select("isActive grade")
      .sort({ grade: 1 });
  }

  setDurationStatus(_id: string, isActive: boolean) {
    return this.durationModel.findByIdAndUpdate(_id, { isActive });
  }

  setCategoryStatus(_id: string, isActive: boolean) {
    return this.categoryModel.findByIdAndUpdate(_id, { isActive });
  }

  setGradeStatus(_id: string, isActive: boolean) {
    return this.gradeModel.findByIdAndUpdate(_id, { isActive });
  }
}
