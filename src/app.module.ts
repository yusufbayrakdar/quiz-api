import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { QuestionModule } from "./question/question.module";
import { QuizModule } from "./quiz/quiz.module";
import { ShapeModule } from "./shape/shape.module";
import { UserModule } from "./user/user.module";
import { ApiModule } from "./utilities/guards/Api.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      autoIndex: false,
      useUnifiedTopology: true,
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
        return connection;
      },
    }),
    AuthModule,
    UserModule,
    QuizModule,
    ShapeModule,
    QuestionModule,
    ApiModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
