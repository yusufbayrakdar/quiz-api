import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { AdminGuard } from "src/utilities/guards/admin.guard";
import { InstructorGuard } from "src/utilities/guards/instructor.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { SearchService } from "./search.service";

@Controller("searches")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @UseGuards(InstructorGuard)
  @Get()
  async paginate(@Query() query: PaginationQueryDto) {
    if (query.ids) query._id = { $in: query.ids.split(".") };
    return await this.searchService.paginate(query);
  }

  @Get("/sync-all")
  @UseGuards(AdminGuard)
  async syncAll() {
    return await this.searchService.syncSearches();
  }

  @UseGuards(InstructorGuard)
  @Get(":_id")
  async detail(@IdParam() _id: string) {
    return await this.searchService.detail(_id);
  }
}
