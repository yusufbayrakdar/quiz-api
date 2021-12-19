import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { RegisterDto } from "src/auth/dto/register.dto";
import { IdParam } from "src/utilities/decorators/paramId.decorator";
import { User } from "src/utilities/decorators/user.decorator";
import { INSTRUCTOR_ALREADY_EXIST } from "src/utilities/errors";
import { ExceptionAlreadyExist } from "src/utilities/exceptions";
import { UserGuard } from "src/utilities/guards/user.guard";
import { PaginationQueryDto } from "src/utilities/helpers/pagination/pagination.validation";
import { InstructorService } from "./instructor.service";

@Controller("instructors")
export class InstructorController {
  constructor(
    private readonly instructorService: InstructorService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async list(@Query() query: PaginationQueryDto) {
    return await this.instructorService.list(query);
  }

  @Post()
  async instructorCreate(@Body() instructorDto: RegisterDto) {
    const instructorExist = await this.instructorService.checkPhone(
      instructorDto.phone
    );

    if (instructorExist)
      throw new ExceptionAlreadyExist(INSTRUCTOR_ALREADY_EXIST);

    const instructor = await this.instructorService.create(instructorDto);

    const token = this.authService.generateInstructorToken(
      instructor._id,
      instructor.phone
    );
    return { instructor, token };
  }

  @Get("profile")
  @UseGuards(UserGuard)
  async profile(@User("_id") instructorId: string) {
    return await this.instructorService.getProfile(instructorId);
  }

  @Get(":_id")
  async detail(@IdParam("_id") instructorId: string) {
    return await this.instructorService.detail(instructorId);
  }

  @Get(":_id/confirm")
  async confirm(@IdParam("_id") instructorId: string) {
    const confirmed = Boolean(
      await this.instructorService.confirm(instructorId)
    );

    return { confirmed };
  }

  @Get(":_id/cancel")
  async cancel(@IdParam("_id") instructorId: string) {
    const canceled = Boolean(await this.instructorService.cancel(instructorId));

    return { canceled };
  }
}
