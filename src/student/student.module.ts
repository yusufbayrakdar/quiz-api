import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { StudentSchema } from "./models/student.schema";
import { InstructorModule } from "src/instructor/instructor.module";
import { StudentInstructorSchema } from "./models/student-instructor.schema";
import { QuizSchema } from "src/quiz/models/quiz.schema";
import { QuizService } from "src/quiz/quiz.service";
import { ScoreSchema } from "src/score/models/score.schema";
import { ScoreService } from "src/score/score.service";

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
      {
        name: "Score",
        schema: ScoreSchema,
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, QuizService, ScoreService],
  exports: [StudentService],
})
export class StudentModule {}
