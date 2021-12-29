import { Module } from "@nestjs/common";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { StudentSchema } from "./models/student.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { InstructorModule } from "src/instructor/instructor.module";
import { StudentInstructorSchema } from "./models/student-instructor.schema";

@Module({
  imports: [
    InstructorModule,
    MongooseModule.forFeature([
      {
        name: "Student",
        schema: StudentSchema,
      },
      {
        name: "StudentInstructor",
        schema: StudentInstructorSchema,
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
