import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'tmp', 'images'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriesModule,
    PlayersModule,
    UploadsModule,
    ChallengesModule,
  ],
})
export class AppModule {}
