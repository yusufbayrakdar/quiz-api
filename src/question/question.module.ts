import { CacheModule, Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { QuestionSchema } from "./models/question.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { DurationSchema } from "./models/duration.schema";
import { CategorySchema } from "./models/category.schema";
import { GradeSchema } from "./models/grade.schema";
import { SearchModule } from "src/search/search.module";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Question",
        schema: QuestionSchema,
      },
      {
        name: "Duration",
        schema: DurationSchema,
      },
      {
        name: "Category",
        schema: CategorySchema,
      },
      {
        name: "Grade",
        schema: GradeSchema,
      },
    ]),
    SearchModule,
  ],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [QuestionService],
})
export class QuestionModule {}
