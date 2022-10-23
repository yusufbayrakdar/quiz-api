// ApiModule
import { Module, Global, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { StudentInstructorSchema } from "src/user/models/student-instructor.schema";
import { UserSchema } from "src/user/models/user.schema";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema,
      },
      {
        name: "StudentInstructor",
        schema: StudentInstructorSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class ApiModule {}
