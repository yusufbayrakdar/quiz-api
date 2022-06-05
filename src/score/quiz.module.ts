import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { ScoreService } from "./score.service";
import { ScoreSchema } from "./models/score.schema";
import { InstructorModule } from "src/instructor/instructor.module";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { SearchModule } from "src/search/search.module";
import { ScoreController } from "./score.controller";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Score",
        schema: ScoreSchema,
      },
    ]),
    InstructorModule,
    forwardRef(() => SearchModule),
    forwardRef(() => ScoreModule),
  ],
  controllers: [ScoreController],
  providers: [
    ScoreService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [ScoreService],
})
export class ScoreModule {}
