import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserSchema } from "./models/user.schema";
import { StudentInstructorSchema } from "./models/student-instructor.schema";
import { AuthModule } from "src/auth/auth.module";
import { QuizStudentSchema } from "src/quiz-student/models/quiz-student.schema";
import { QuizStudentService } from "src/quiz-student/quiz-student.service";
import { QuizStudentModule } from "src/quiz-student/quiz-student.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => QuizStudentModule),
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema,
      },
      {
        name: "StudentInstructor",
        schema: StudentInstructorSchema,
      },
      {
        name: "QuizStudent",
        schema: QuizStudentSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, QuizStudentService],
  exports: [UserService],
})
export class UserModule {}
