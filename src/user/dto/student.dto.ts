import { IsOptional, IsString, Length } from "class-validator";
import { IsPhone } from "src/utilities/decorators/phone.decorator";

export class StudentDto {
  @IsString()
  @Length(4, 32)
  fullName: string;

  @IsString()
  @Length(4, 32)
  nickname: string;

  @IsOptional()
  @IsPhone()
  phone?: string;
}
