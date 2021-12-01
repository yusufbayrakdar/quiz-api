import { IsMongoId, IsNumber } from "class-validator";

export class CreateQuizDto {
  @IsMongoId({ each: true })
  questions: Array<string>;

  @IsNumber()
  duration: number;
}
