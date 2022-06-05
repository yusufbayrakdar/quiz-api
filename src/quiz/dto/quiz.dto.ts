import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class QuizDto {
  @IsMongoId({ each: true })
  questionList: Array<string>;

  @IsMongoId({ each: true })
  assignedStudents: Array<string>;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  name: string;
}
