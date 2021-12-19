import { IsOptional, IsString, Length } from "class-validator";
import { IsPhone } from "src/utilities/decorators/phone.decorator";

export class StudentDto {
  @IsString()
  @Length(3, 20)
  firstName: string;

  @IsString()
  @Length(2, 20)
  lastName: string;

  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsOptional()
  @IsPhone()
  phone?: string;
}
