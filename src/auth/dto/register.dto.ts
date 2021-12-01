import { IsNotEmpty, IsString, Length } from "class-validator";
import { IsPhone } from "src/utilities/decorators/phone.decorator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsPhone()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
