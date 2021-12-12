import { IsString, Length } from "class-validator";

export class LoginStaffDto {
  @IsString()
  @Length(3, 20)
  nickname: string;

  @IsString()
  @Length(6, 20)
  readonly password: string;
}
