import { Module } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { StaffController } from "./staff.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { StaffSchema } from "./models/staff.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Staff", schema: StaffSchema }]),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
