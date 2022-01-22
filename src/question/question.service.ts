import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
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

  getPopulatedQuestionById(questionId: string) {
    return this.questionModel
      .findById(questionId)
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
      .then((question: any) => {
        const prepared = {
          isActive: question.isActive,
          category: question.category.category,
          duration: question.duration.duration,
          grade: question.grade.grade,
          correctAnswer: question.correctAnswer,
          creator: `${question.creator.firstName} ${question.creator.lastName}`,
          question: question.question.map((e) => ({
            shape: e.shape.imageUrl,
            coordinate: e.coordinate,
          })),
          choices: question.choices.map((e) => ({
            shape: e.shape.imageUrl,
            coordinate: e.coordinate,
          })),
        };
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

  createDuration(duration: number) {
    return this.durationModel.findOneAndUpdate(
      { duration },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  getDurations() {
    return this.durationModel
      .find({ isActive: true })
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

  getCategories() {
    return this.categoryModel
      .find({ isActive: true })
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

  getGrades() {
    return this.gradeModel
      .find({ isActive: true })
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
