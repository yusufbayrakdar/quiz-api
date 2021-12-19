import { forwardRef, Module } from "@nestjs/common";
import { InstructorService } from "./instructor.service";
import { InstructorController } from "./instructor.controller";
import { InstructorSchema } from "./models/instructor.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: "Instructor",
        schema: InstructorSchema,
      },
    ]),
  ],
  controllers: [InstructorController],
  providers: [InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
