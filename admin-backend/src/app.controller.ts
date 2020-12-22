import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @MessagePattern('get-categories')
  async getCategories(): Promise<Category[]> {
    return this.appService.getCategories();
  }

  @MessagePattern('get-category')
  async getCategory(@Payload() _id: string): Promise<Category> {
    return this.appService.getCategory(_id);
  }

  @MessagePattern('create-category')
  async createCategory(@Payload() category: Category): Promise<Category> {
    this.logger.verbose(`category: ${JSON.stringify(category)}`);
    return this.appService.createCategory(category);
  }
}
