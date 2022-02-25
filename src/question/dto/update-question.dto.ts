import { IsMongoId } from "class-validator";

import { QuestionDto } from "./question.dto";

export class UpdateQuestionDto extends QuestionDto {
  @IsMongoId()
  _id: string;
}
