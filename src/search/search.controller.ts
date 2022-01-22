import { Controller, Get, Query } from "@nestjs/common";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { SearchService } from "./search.service";

@Controller("searches")
export class SearchController {
  constructor(private readonly questionService: SearchService) {}
  @Get()
  async paginate(@Query() query: PaginationQueryDto) {
    return await this.questionService.paginate(query);
  }
}
