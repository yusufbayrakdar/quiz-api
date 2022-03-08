import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

class Shape {
  @IsMongoId()
  shape: string;

  @IsString()
  @IsNotEmpty()
  coordinate: string;
}

export class QuestionDto {
  @IsArray()
  question: Array<Shape>;

  @IsArray()
  choices: Array<Shape>;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsMongoId()
  duration: string;

  @IsMongoId()
  category: string;

  @IsMongoId()
  grade: string;

  @IsOptional()
  @IsString()
  videoUrl: string;

  @IsOptional()
  @IsString()
  description: string;
}
