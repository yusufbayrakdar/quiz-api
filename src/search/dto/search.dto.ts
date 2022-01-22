import { IsMongoId, IsObject } from "class-validator";

export class QuestionDto {
  @IsObject()
  question: Object;

  @IsObject()
  choices: Object;

  @IsMongoId()
  duration: string;

  @IsMongoId()
  category: string;

  @IsMongoId()
  grade: string;
}
