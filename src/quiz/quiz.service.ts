import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment";
import { Model } from "mongoose";

import { Quiz, QuizSelects } from "./entities/quiz.entity";

@Injectable()
export class QuizService {
  constructor(@InjectModel("Quiz") private examModel: Model<Quiz>) {}
}
