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

@Controller('api/v1/categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(
    @Inject('admin-backend')
    private clientAdminBackend: ClientProxy,
  ) {}

  @Get(':_id')
  @UsePipes(ValidationPipe)
  getCategory(@Param() findParamDTO: FindParamDTO): Observable<any> {
    return this.clientAdminBackend.send('get-category', findParamDTO._id);
  }

  @Get()
  getCategories(): Observable<any> {
    return this.clientAdminBackend.send('get-categories', {});
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Observable<any[]> {
    return this.clientAdminBackend.send('create-category', createCategoryDTO);
  }

  @Put(':_id')
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
