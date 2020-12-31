import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './categories/interfaces/players/player.schema';
import { CategoriesModule } from './categories/categories.module';

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
        name: 'Player',
        schema: PlayerSchema,
      },
    ]),
    CategoriesModule,
  ],
})
export class AppModule {}
