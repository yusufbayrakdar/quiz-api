import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class CreateShapeDto {
  @IsNotEmpty()
  @IsString()
  searchTag: string;

  @IsString()
  imageName: string;

  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsMongoId()
  _id?: string;
}
