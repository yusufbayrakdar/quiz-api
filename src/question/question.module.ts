import { CacheModule, Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { QuestionSchema } from "./models/question.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { InstructorModule } from "src/instructor/instructor.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Question",
        schema: QuestionSchema,
      },
    ]),
    InstructorModule,
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
