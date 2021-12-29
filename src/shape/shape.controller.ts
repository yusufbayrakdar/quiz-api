import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { IdParam } from "src/utilities/decorators/paramId.decorator";

import { IMAGE_ALREADY_EXIST } from "src/utilities/errors";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { CreateShapeDto } from "./dto/create-shape.dto";
import { ShapeService } from "./shape.service";

@Controller("shapes")
export class ShapeController {
  constructor(private readonly shapeService: ShapeService) {}
  @Get()
  async list(@Query() query: PaginationQueryDto) {
    return await this.shapeService.list(query);
  }

  @Get(":_id")
  async detail(@IdParam() _id: string) {
    return await this.shapeService.detail(_id);
  }

  @Post()
  async create(@Body() createShapeDto: CreateShapeDto) {
    const imageExists = await this.shapeService.exists({
      imageName: createShapeDto.imageName,
    });
    if (imageExists) throw new BadRequestException(IMAGE_ALREADY_EXIST);

    return this.shapeService.findOneAndUpdate(createShapeDto);
  }

  @Put()
  async update(@Body() createShapeDto: CreateShapeDto) {
    const { _id } = createShapeDto;
    const imageExists = await this.shapeService.exists({
      imageName: createShapeDto.imageName,
      _id: { $ne: _id },
    });
    if (imageExists) throw new BadRequestException(IMAGE_ALREADY_EXIST);

    return this.shapeService.findByIdAndUpdate(_id, createShapeDto);
  }
}
