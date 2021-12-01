import { IsString, Length } from "class-validator";
import { IsPhone } from "src/utilities/decorators/phone.decorator";

export class LoginDto {
  @IsPhone()
  phone: string;

  @IsString()
  @Length(6, 20)
  readonly password: string;
}
