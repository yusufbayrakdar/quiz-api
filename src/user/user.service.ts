import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

import { User, UserSelects } from "./entities/user.entity";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { StudentInstructor } from "./entities/student-instructor.entity";
import ROLES from "src/utilities/roles";

@Injectable()
export class UserService {
  constructor(
    @InjectModel("User") private userModel: Model<User>,
    @InjectModel("StudentInstructor")
    private studentInstructorModel: Model<StudentInstructor>
  ) {}

  async create(user) {
    const createdUser = await this.userModel.create(user);
    return this.sanitizeUser(createdUser);
  }

  paginate(query, select) {
    const { hasPhone } = query;
    const customFilters: any = {};
    if (hasPhone === "true") {
      customFilters.phone = { $ne: null };
    } else if (hasPhone === "false") {
      customFilters.phone = null;
    }

    console.log("query", query);
    return paginationHelper({
      Model: this.userModel,
      query,
      customFilters,
      searchableFields: ["fullName", "phone"],
      filterableFields: ["_id", "confirmed", "role"],
      select,
    });
  }

  find(query, select) {
    return this.userModel.find(query).select(select).lean();
  }

  findOne(query, select) {
    return this.userModel.findOne(query).select(select).lean();
  }

  findById(_id, select) {
    return this.userModel.findById(_id).select(select).lean();
  }

  checkConfirmed = (phone: string) =>
    this.userModel.exists({ phone, confirmed: true });

  exists(instructor) {
    return this.userModel.exists(instructor);
  }

  async findByLogin(userDto) {
    const { phone, nickname, password } = userDto;

    const filter = nickname
      ? { nickname, isActive: true }
      : { phone, isActive: true };
    const { role } = await this.userModel.findOne(filter).select("role");
    const user = await this.userModel
      .findOne(filter)
      .select(UserSelects[role.toUpperCase()]?.withPassword);

    const passStudentWithInitialPassword =
      !user.password &&
      user.role === ROLES.STUDENT &&
      password === user.passwordInit;
    const passUserWithPassword =
      user.password && (await bcrypt.compare(password, user.password));
    if (passUserWithPassword || passStudentWithInitialPassword) {
      return this.sanitizeUser(user);
    }
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized["password"];
    return sanitized;
  }

  confirm(_id: string) {
    return this.userModel.findByIdAndUpdate(_id, {
      confirmed: true,
      role: ROLES.INSTRUCTOR,
    });
  }

  cancel(_id: string) {
    return this.userModel.findByIdAndUpdate(_id, {
      confirmed: false,
    });
  }

  async getProfile(_id) {
    const { role } = await this.userModel.findById(_id).select("role");
    return this.userModel
      .findById(_id)
      .select(UserSelects[role.toUpperCase()].basic);
  }

  getDashboard(_id) {
    return this.studentInstructorModel.countDocuments({ instructor: _id });
  }

  async detail(_id) {
    const { role } = await this.userModel.findById(_id).select("role");
    return this.userModel.findById(_id).select(UserSelects[role]?.basic);
  }

  getStudentsOfInstructor(instructor) {
    return this.studentInstructorModel
      .find({ instructor, isActive: true })
      .distinct("student");
  }

  getInstructorsOfStudent(student) {
    return this.studentInstructorModel
      .find({ student, isActive: true })
      .distinct("instructor");
  }

  createRelation({ studentId, instructorId }) {
    return this.studentInstructorModel
      .findOneAndUpdate(
        { student: studentId, instructor: instructorId },
        {},
        { upsert: true, setDefaultsOnInsert: true }
      )
      .select(UserSelects.STUDENT.basic);
  }

  checkInstructorAuthOnStudent(instructorId, studentId) {
    return this.studentInstructorModel.exists({
      instructor: instructorId,
      student: studentId,
    });
  }

  delete(student, instructor) {
    return this.studentInstructorModel.findOneAndUpdate(
      { student, instructor },
      { isActive: false }
    );
  }

  add({ student, instructor }) {
    return this.studentInstructorModel.findOneAndUpdate(
      { student, instructor },
      { isActive: true },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  async deleteForAll(student) {
    await this.userModel.findByIdAndUpdate(student, { isActive: false });
    return this.studentInstructorModel.findOneAndUpdate(
      { student },
      { isActive: false }
    );
  }

  studentIdsOfInstructor(query) {
    return this.studentInstructorModel.find(query).distinct("student");
  }

  list(query, select) {
    return this.userModel.find(query).select(select).lean();
  }

  findOneByNickName(nickname, excludeId?) {
    const excludeQuery = excludeId ? { _id: { $ne: excludeId } } : {};
    return this.userModel
      .findOne({ nickname, isActive: true, ...excludeQuery })
      .select(UserSelects.STUDENT.basic);
  }

  findOneAndUpdate({
    user,
    update,
    getNew,
    upsert = true,
  }: {
    user: object;
    update: object;
    getNew?: boolean;
    upsert?: boolean;
  }) {
    const newOption = getNew ? { new: true } : {};
    return this.userModel.findOneAndUpdate(user, update, {
      upsert,
      setDefaultsOnInsert: true,
      runValidators: true,
      ...newOption,
    });
  }

  updateManyStudentInstructor(filter, update, config = {}) {
    return this.studentInstructorModel.updateMany(filter, update, {
      upsert: true,
      setDefaultsOnInsert: true,
      ...config,
    });
  }
}
