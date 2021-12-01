import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

const config = new DocumentBuilder()
  .setTitle("Quiz")
  .setDescription("Quiz API")
  .setVersion("1.0")
  .addApiKey({ type: "apiKey", name: "token", in: "header" }, "token")
  .addApiKey({ type: "apiKey", name: "tokenstaff", in: "header" }, "tokenstaff")
  .build();

export const SwaggerSetup = (app: any) => {
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
};
