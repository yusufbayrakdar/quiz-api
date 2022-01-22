import { IsNumberString } from "class-validator";

export class DurationDto {
  @IsNumberString()
  duration: number;
}
