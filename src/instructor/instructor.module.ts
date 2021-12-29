import { forwardRef, Module } from "@nestjs/common";
import { InstructorService } from "./instructor.service";
import { InstructorController } from "./instructor.controller";
import { InstructorSchema } from "./models/instructor.schema";
import { StudentInstructorSchema } from "../student/models/student-instructor.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: "Instructor",
        schema: InstructorSchema,
      },
      {
        name: "StudentInstructor",
        schema: StudentInstructorSchema,
      },
    ]),
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
