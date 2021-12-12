import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "src/utilities/decorators/user.decorator";
import { StaffService } from "./staff.service";
import { StaffGuard } from "src/utilities/guards/staff.guard";

@Controller("staffs")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get("profile")
  @UseGuards(StaffGuard)
  async profile(@User("_id") staffId: string) {
    return await this.staffService.getProfile(staffId);
  }
}
