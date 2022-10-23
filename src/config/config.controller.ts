import { Controller, Get, UseGuards } from "@nestjs/common";

import { AdminGuard } from "src/utilities/guards/admin.guard";
import { ConfigService } from "./config.service";

@Controller("configs")
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(AdminGuard)
  @Get("firebase")
  async getFirebaseConfig() {
    let FIREBASE_CONFIG = {};

    try {
      FIREBASE_CONFIG = JSON.parse(
        Buffer.from(process.env.FIREBASE_CONFIG_IN_BASE64, "base64").toString()
      );
    } catch (error) {
      throw new Error("Firebase Config bulunamadı");
    }

    return FIREBASE_CONFIG;
  }
}
