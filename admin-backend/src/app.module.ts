import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategorySchema } from './interfaces/categories/category.schema';
import { PlayerSchema } from './interfaces/players/player.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/smartranking-adminbackend',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    MongooseModule.forFeature([
      {
        name: 'Category',
        schema: CategorySchema,
      },
      {
        name: 'Player',
        schema: PlayerSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
