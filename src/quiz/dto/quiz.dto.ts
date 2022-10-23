import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class QuizDto {
  @IsMongoId({ each: true })
  questionList: Array<string>;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  name: string;
}
