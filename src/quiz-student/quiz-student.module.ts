import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { QuizStudentSchema } from "./models/quiz-student.schema";
import { QuizStudentService } from "./quiz-student.service";
import { UserSchema } from "src/user/models/user.schema";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      {
        name: "QuizStudent",
        schema: QuizStudentSchema,
      },
      {
        name: "User",
        schema: UserSchema,
      },
    ]),
  ],
  providers: [QuizStudentService],
  exports: [QuizStudentService],
})
export class QuizStudentModule {}
