import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model } from "mongoose";

import { Staff, StaffSelects } from "./entities/staff.entity";
import { convertSelectsForAggregate } from "src/utilities/helpers";

@Injectable()
export class StaffService {
  constructor(@InjectModel("Staff") private staffModel: Model<Staff>) {}

  async findByLogin(staffDto) {
    const { nickname, password } = staffDto;
    const staff = await this.staffModel.findOneAndUpdate(
      { nickname },
      { lastLoginDate: new Date() },
      {
        fields: convertSelectsForAggregate(StaffSelects.basic),
        new: true,
      }
    );

    if (!staff) {
      throw new BadRequestException("Invalid credentials");
    }

    if (await bcrypt.compare(password, staff.password)) {
      return this.sanitizeStaff(staff);
    } else {
      throw new BadRequestException("Invalid credentials");
    }
  }

  sanitizeStaff(staff: Staff) {
    const sanitized = staff.toObject();
    delete sanitized["password"];
    return sanitized;
  }

  getProfile(_id) {
    return this.staffModel.findById(_id).select(StaffSelects.basic);
  }
}
