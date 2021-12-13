import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

import { ExceptionBadRequest } from "src/utilities/exceptions";
import { Student, StudentSelects } from "./entities/student.entity";
import { StudentInstructor } from "./entities/student-instructor.entity";
import { FAILED_LOGIN } from "src/utilities/errors";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";

@Injectable()
export class StudentService {
  constructor(
    @InjectModel("Student") private studentModel: Model<Student>,
    @InjectModel("StudentInstructor")
    private studentInstructorModel: Model<StudentInstructor>
  ) {}

  async createOrUpdate(student, instructorId) {
    const newStudent = await this.studentModel.findOneAndUpdate(
      student,
      {},
      { upsert: true, setDefaultsOnInsert: true, new: true }
    );

    await this.studentInstructorModel.findOneAndUpdate(
      { student: newStudent._id, instructor: instructorId },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );
    return this.sanitizeStudent(newStudent);
  }

  list(query) {
    return paginationHelper({
      Model: this.studentModel,
      query,
      searchableFields: ["firstName", "lastName", "phone"],
      filterableFields: ["_id"],
    });
  }

  studentsOfInstructor(query) {
    // TODO: add pagination manually
    // return this.studentInstructorModel.paginate(query);
    query.instructor = new mongoose.Types.ObjectId(query.instructor);
    return paginationHelper({
      Model: this.studentInstructorModel,
      query,
      searchableFields: ["firstName", "lastName", "phone"],
      filterableFields: ["instructor"],
      populate: [
        {
          path: "student",
          select: StudentSelects.basic,
        },
      ],
    });
  }

  checkPhone = (phone: string) => this.studentModel.exists({ phone });

  checkConfirmed = (email: string) =>
    this.studentModel.exists({ email, confirmed: true });

  exists(student) {
    return this.studentModel.exists(student);
  }

  async findByLogin(studentDto) {
    const { phone, password } = studentDto;
    const student = await this.studentModel
      .findOne({ phone })
      .select(StudentSelects.withPassword);

    if (
      student?.password &&
      (await bcrypt.compare(password, student.password))
    ) {
      return this.sanitizeStudent(student);
    }
  }

  // updateProfile(_id, studentNames: UpdateProfileAuthDto) {
  //   return this.studentModel.findByIdAndUpdate(_id, studentNames);
  // }

  sanitizeStudent(student: Student) {
    const sanitized = student.toObject();
    delete sanitized["password"];
    return sanitized;
  }

  getProfile = (_id) =>
    this.studentModel.findById(_id).select(StudentSelects.basic);
}
