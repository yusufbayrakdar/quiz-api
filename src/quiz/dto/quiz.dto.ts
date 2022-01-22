import { IsMongoId, IsNumber } from "class-validator";

export class QuizDto {
  @IsMongoId({ each: true })
  questions: Array<string>;

  @IsNumber()
  duration: number;
}
