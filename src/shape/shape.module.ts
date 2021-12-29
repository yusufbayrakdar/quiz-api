import { CacheModule, Module } from "@nestjs/common";
import { ShapeService } from "./shape.service";
import { ShapeController } from "./shape.controller";
import { ShapeSchema } from "./models/shape.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { InstructorModule } from "src/instructor/instructor.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: "Shape",
        schema: ShapeSchema,
      },
    ]),
    InstructorModule,
  ],
  controllers: [ShapeController],
  providers: [
    ShapeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [ShapeService],
})
export class ShapeModule {}
