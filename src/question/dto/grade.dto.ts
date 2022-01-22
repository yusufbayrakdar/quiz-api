import { IsNotEmpty, IsString } from "class-validator";

export class GradeDto {
  @IsString()
  @IsNotEmpty()
  grade: string;
}
