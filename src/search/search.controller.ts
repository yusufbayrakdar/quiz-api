import { Controller, Get, Query, UseGuards } from "@nestjs/common";

import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { StaffGuard } from "src/utilities/guards/staff.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { SearchService } from "./search.service";

@Controller("searches")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get()
  async paginate(@Query() query: PaginationQueryDto) {
    if (query.ids) query._id = { $in: query.ids.split(".") };
    return await this.searchService.paginate(query);
  }

  @Get("/sync-all")
  @UseGuards(StaffGuard)
  async syncAll() {
    return await this.searchService.syncSearches();
  }

  @Get(":_id")
  async detail(@IdParam() _id: string) {
    return await this.searchService.detail(_id);
  }
}
