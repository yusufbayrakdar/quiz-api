import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { SearchSchema } from "./models/search.schema";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { QuestionModule } from "src/question/question.module";
import { QuizModule } from "src/quiz/quiz.module";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Search",
        schema: SearchSchema,
      },
    ]),
    forwardRef(() => QuestionModule),
    forwardRef(() => QuizModule),
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}
