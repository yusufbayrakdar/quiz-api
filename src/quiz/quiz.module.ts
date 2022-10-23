import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { QuizSchema } from "./models/quiz.schema";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { SearchModule } from "src/search/search.module";
import { ScoreModule } from "src/score/score.module";
import { QuestionModule } from "src/question/question.module";
import { QuizStudentModule } from "src/quiz-student/quiz-student.module";
import { QuizStudentSchema } from "src/quiz-student/models/quiz-student.schema";
import { UserModule } from "src/user/user.module";
import { UserSchema } from "src/user/models/user.schema";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Quiz",
        schema: QuizSchema,
      },
      {
        name: "QuizStudent",
        schema: QuizStudentSchema,
      },
      {
        name: "User",
        schema: UserSchema,
      },
    ]),
    forwardRef(() => SearchModule),
    forwardRef(() => ScoreModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => QuizStudentModule),
    forwardRef(() => UserModule),
  ],
  controllers: [QuizController],
  providers: [
    QuizService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [QuizService],
})
export class QuizModule {}
