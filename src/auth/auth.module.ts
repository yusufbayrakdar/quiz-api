import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { InstructorModule } from "../instructor/instructor.module";
import { StudentModule } from "../student/student.module";
import { StaffModule } from "src/staff/staff.module";

@Module({
  imports: [InstructorModule, StudentModule, StaffModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
