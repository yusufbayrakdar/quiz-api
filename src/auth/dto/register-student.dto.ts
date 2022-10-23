import { IsNotEmpty, IsString, Length } from "class-validator";
import ROLES from "src/utilities/roles";

export class RegisterDtoStudent {
  @IsString()
  @IsNotEmpty()
  role: ROLES.STUDENT;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
}
