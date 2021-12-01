import { Controller } from "@nestjs/common";

import { InstructorService } from "src/instructor/instructor.service";
import { QuizService } from "./quiz.service";

@Controller("quiz")
export class QuizController {
  constructor(
    private readonly examService: QuizService,
    private readonly userService: InstructorService
  ) {}
}
