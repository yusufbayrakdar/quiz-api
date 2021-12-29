import { Document } from "mongoose";

export class Shape extends Document {
  searchTag: string;
  imageUrl: string;
}

export const ShapeSelects = {
  basic: "searchTag imageName imageUrl",
};
