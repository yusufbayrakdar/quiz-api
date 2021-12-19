import { IsOptional, IsString, Length } from "class-validator";
import { IsPhone } from "src/utilities/decorators/phone.decorator";

export class LoginDto {
  @IsOptional()
  @IsPhone()
  phone?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsString()
  @Length(4, 20)
  readonly password: string;
}
