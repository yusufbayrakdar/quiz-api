import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

import { Instructor, InstructorSelects } from "./entities/instructor.entity";
import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel("Instructor") private instructorModel: Model<Instructor>
  ) {}

  async create(instructor) {
    const createdInstructor = await this.instructorModel.create(instructor);
    return this.sanitizeInstructor(createdInstructor);
  }

  list(query) {
    return paginationHelper({
      Model: this.instructorModel,
      query,
      searchableFields: ["firstName", "lastName", "phone"],
    });
  }

  checkPhone = (phone: string) => this.instructorModel.exists({ phone });

  checkConfirmed = (phone: string) =>
    this.instructorModel.exists({ phone, confirmed: true });

  exists(instructor) {
    return this.instructorModel.exists(instructor);
  }

  async findByLogin(instructorDto) {
    const { phone, password } = instructorDto;
    const instructor = await this.instructorModel
      .findOne({ phone })
      .select(InstructorSelects.withPassword);

    if (
      instructor?.password &&
      (await bcrypt.compare(password, instructor.password))
    ) {
      return this.sanitizeInstructor(instructor);
    }
  }

  // updateProfile(_id, instructorNames: UpdateProfileAuthDto) {
  //   return this.instructorModel.findByIdAndUpdate(_id, instructorNames);
  // }

  sanitizeInstructor(instructor: Instructor) {
    const sanitized = instructor.toObject();
    delete sanitized["password"];
    return sanitized;
  }

  confirm(_id: string) {
    return this.instructorModel.findByIdAndUpdate(_id, {
      confirmed: true,
    });
  }

  getProfile(_id) {
    return this.instructorModel.findById(_id).select(InstructorSelects.basic);
  }
}
