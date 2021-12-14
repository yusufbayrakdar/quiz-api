import { Type } from "class-transformer";
import {
  IsString,
  IsObject,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateNested,
  IsBooleanString,
  Min,
  IsNotEmpty,
  IsMongoId,
} from "class-validator";
// import { IsStringSafe } from "../../validators/isStringSafe";

export class PaginationQueryDto {
  @IsOptional()
  _id?: any;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsBooleanString()
  all: boolean;

  @IsOptional()
  @IsMongoId()
  instructor: string;

  @IsOptional()
  @IsMongoId()
  student: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsBooleanString()
  isActive: boolean;
}

export class Pagination {
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationQueryDto)
  query: PaginationQueryDto;

  @IsOptional()
  @IsObject()
  defaultQuery?: Object;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  filterableFields?: Array<string>;

  @IsOptional()
  @IsObject()
  customFilters?: Object;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultPage?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultLimit?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchableFields?: Array<string>;

  @IsOptional()
  @IsObject()
  sortOptions?: Object;

  @IsOptional()
  select?: string;

  @IsOptional()
  populate?: any;

  @IsOptional()
  Model: any;

  @IsOptional()
  @IsBoolean()
  lean?: boolean;
}
