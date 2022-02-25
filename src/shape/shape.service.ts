import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import paginationHelper from "src/utilities/helpers/pagination/pagination.helper";
import { Shape, ShapeSelects } from "./entities/shape.entity";

@Injectable()
export class ShapeService {
  constructor(@InjectModel("Shape") private shapeModel: Model<Shape>) {}

  list(query) {
    return paginationHelper({
      Model: this.shapeModel,
      query,
      searchableFields: ["searchTag", "imageName", "phone"],
      filterableFields: ["_id"],
      select: ShapeSelects.basic,
      sortOptions: { order: 1, searchTag: 1 },
      defaultLimit: 150,
    });
  }

  detail(id: string) {
    return this.shapeModel.findById(id).select(ShapeSelects.basic);
  }

  async findOneAndUpdate(shape) {
    const { imageName, imageUrl, searchTag } = shape;
    await this.shapeModel.findOneAndUpdate(
      { imageName },
      { searchTag, imageUrl },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  async findByIdAndUpdate(_id, shape) {
    const { imageName, imageUrl, searchTag } = shape;
    await this.shapeModel.findByIdAndUpdate(
      _id,
      { searchTag, imageUrl, imageName },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  exists(filter: object) {
    return this.shapeModel.exists(filter);
  }

  deleteById(id: string) {
    return this.shapeModel.findByIdAndDelete(id);
  }
}
