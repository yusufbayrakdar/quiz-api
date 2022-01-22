import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InstructorModule } from "src/instructor/instructor.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { SearchSchema } from "./models/search.schema";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { QuestionModule } from "src/question/question.module";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Search",
        schema: SearchSchema,
      },
    ]),
    InstructorModule,
    forwardRef(() => QuestionModule),
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
