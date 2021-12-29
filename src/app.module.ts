import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { QuizModule } from "./quiz/quiz.module";
import { ShapeModule } from "./shape/shape.module";

const database =
  process.env.NODE_ENV === "development"
    ? process.env.MONGO_URI_DEV
    : process.env.MONGO_URI;

@Module({
  imports: [
    MongooseModule.forRoot(database, {
      useNewUrlParser: true,
      autoIndex: false,
      useUnifiedTopology: true,
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
        return connection;
      },
    }),
    AuthModule,
    QuizModule,
    ShapeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
