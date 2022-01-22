import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class QuestionDto {
  @IsArray()
  question: Array<Object>;

  @IsArray()
  choices: Array<Object>;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsMongoId()
  duration: string;

  @IsMongoId()
  category: string;

  @IsMongoId()
  grade: string;
}
