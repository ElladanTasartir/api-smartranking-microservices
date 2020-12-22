import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { FindParamDTO } from './dtos/find-param.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Get('categories/:_id')
  @UsePipes(ValidationPipe)
  getCategory(@Param() findParamDTO: FindParamDTO): Observable<any> {
    return this.clientAdminBackend.send('get-category', findParamDTO._id);
  }

  @Get('categories')
  getCategories(): Observable<any> {
    return this.clientAdminBackend.send('get-categories', {});
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Observable<any[]> {
    return this.clientAdminBackend.send('create-category', createCategoryDTO);
  }
}
