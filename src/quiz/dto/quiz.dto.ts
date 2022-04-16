import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class QuizDto {
  @IsOptional()
  @IsMongoId()
  _id: string;

  @IsMongoId({ each: true })
  questionList: Array<string>;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  name: string;
}
