import { IsArray, IsMongoId, IsNumber } from "class-validator";

export class ScoreDto {
  @IsMongoId()
  quiz: string;

  @IsArray()
  answerList: { questionId: string; answer: string }[];

  @IsNumber()
  finishedAt: number;
}
