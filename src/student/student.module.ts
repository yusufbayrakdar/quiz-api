import { Module } from "@nestjs/common";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { StudentSchema } from "./models/student.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { InstructorModule } from "src/instructor/instructor.module";
import { StudentInstructorSchema } from "./models/student-instructor.schema";
import { QuizSchema } from "src/quiz/models/quiz.schema";
import { QuizService } from "src/quiz/quiz.service";

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
      {
        name: "Quiz",
        schema: QuizSchema,
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, QuizService],
  exports: [StudentService],
})
export class StudentModule {}
