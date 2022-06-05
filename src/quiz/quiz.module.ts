import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { QuizController } from "./quiz.controller";
import { QuizSchema } from "./models/quiz.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { InstructorModule } from "src/instructor/instructor.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { SearchModule } from "src/search/search.module";
import { ScoreModule } from "src/score/quiz.module";
import { QuestionModule } from "src/question/question.module";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Quiz",
        schema: QuizSchema,
      },
    ]),
    InstructorModule,
    forwardRef(() => SearchModule),
    forwardRef(() => ScoreModule),
    forwardRef(() => QuestionModule),
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
