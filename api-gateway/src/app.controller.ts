import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { FindParamDTO } from './dtos/find-param.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    @Inject('admin-backend')
    private clientAdminBackend: ClientProxy,
  ) {}

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

  @Put('categories/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Param() findParamDTO: FindParamDTO,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Observable<any> {
    return this.clientAdminBackend.send('update-category', {
      id: findParamDTO._id,
      category: updateCategoryDTO,
    });
  }
}
