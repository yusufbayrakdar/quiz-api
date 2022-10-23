import { IsMongoId } from "class-validator";
import { StudentDto } from "./student.dto";

export class UpdateStudentDto extends StudentDto {
  @IsMongoId()
  _id: string;
}
