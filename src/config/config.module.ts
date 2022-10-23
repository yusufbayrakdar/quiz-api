import { CacheModule, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { ConfigService } from "./config.service";
import { HttpCacheInterceptor } from "src/shared/http-cache.interceptor";
import { ConfigController } from "./config.controller";

@Module({
  imports: [CacheModule.register()],
  controllers: [ConfigController],
  providers: [
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
