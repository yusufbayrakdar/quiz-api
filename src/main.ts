import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import * as Express from "express";
import * as cors from "cors";
import "dotenv/config";

import { TransformInterceptor } from "./shared/response.interceptor";
import { AppModule } from "./app.module";
import { loggerMiddleware } from "./utilities/logger";
import { SwaggerSetup } from "./utilities/swagger-setup";

const server = Express();
server.use(cors());

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  if (process.env.NODE_ENV !== "production") SwaggerSetup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(loggerMiddleware);
  app.enableCors();
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
