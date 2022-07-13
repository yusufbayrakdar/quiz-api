import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

import { Student, StudentSelects } from "./entities/student.entity";
import { StudentInstructor } from "./entities/student-instructor.entity";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";

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
    const { hasPhone } = query;
    const customFilters: any = {};
    if (hasPhone === "true") {
      customFilters.phone = { $ne: null };
    } else if (hasPhone === "false") {
      customFilters.phone = null;
    }
    return paginationHelper({
      Model: this.studentModel,
      query,
      customFilters,
      searchableFields: ["firstName", "lastName", "phone"],
      filterableFields: ["_id"],
    });
  }

  async studentsOfInstructor(query) {
    const studentIds = await this.studentInstructorModel
      .find({ instructor: query.instructor })
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
      Model: this.studentModel,
      query,
      customFilters,
      searchableFields: ["firstName", "lastName", "nickname", "phone"],
      filterableFields: ["_id"],
    });
  }

  checkPhone = (phone: string) => this.studentModel.exists({ phone });

  checkConfirmed = (email: string) =>
    this.studentModel.exists({ email, confirmed: true });

  exists(student) {
    return this.studentModel.exists(student);
  }

  async findByLogin(studentDto) {
    const { nickname, password } = studentDto;
    const student = await this.studentModel
      .findOne({ nickname })
      .select(StudentSelects.withPassword);

    const isValid = student?.password
      ? await bcrypt.compare(password, student.password)
      : student?.passwordInit === password;
    if (isValid) {
      return this.sanitizeStudent(student);
    }
  }

  sanitizeStudent(student: Student) {
    const sanitized = student.toObject();
    delete sanitized["password"];
    return sanitized;
  }

  getProfile(_id) {
    return this.studentModel.findById(_id).select(StudentSelects.basic).lean();
  }

  checkInstructorAuthForStudent(instructorId, studentId) {
    return this.studentInstructorModel.exists({
      instructor: instructorId,
      student: studentId,
    });
  }

  findOneByNickName(nickname, excludeId?) {
    const excludeQuery = excludeId ? { _id: { $ne: excludeId } } : {};
    return this.studentModel
      .findOne({ nickname, ...excludeQuery })
      .select(StudentSelects.basic);
  }
  findOneAndUpdate({
    student,
    update,
    getNew,
    upsert = true,
  }: {
    student: object;
    update: object;
    getNew?: boolean;
    upsert?: boolean;
  }) {
    const newOption = getNew ? { new: true } : {};
    return this.studentModel.findOneAndUpdate(student, update, {
      upsert,
      setDefaultsOnInsert: true,
      ...newOption,
    });
  }
  createRelation({ studentId, instructorId }) {
    return this.studentInstructorModel
      .findOneAndUpdate(
        { student: studentId, instructor: instructorId },
        {},
        { upsert: true, setDefaultsOnInsert: true }
      )
      .select(StudentSelects.basic);
  }
  delete(studentId) {
    return this.studentModel.findByIdAndDelete(studentId);
  }
}
