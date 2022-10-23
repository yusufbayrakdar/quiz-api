import { IsMongoId } from "class-validator";

export class AssignQuizDto {
  @IsMongoId({ each: true })
  students: Array<string>;
}
