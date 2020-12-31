import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { updateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

const ackErrors: number[] = [11000];

@Controller()
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('get-categories')
  async getCategories(@Ctx() context: RmqContext): Promise<Category[]> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    await channel.ack(message);
    return this.categoriesService.getCategories();
  }

  @MessagePattern('get-category')
  async getCategory(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    await channel.ack(message);
    return this.categoriesService.getCategory(_id);
  }

  @MessagePattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    this.logger.verbose(`category: ${JSON.stringify(category)}`);

    try {
      const createdCategory = await this.categoriesService.createCategory(
        category,
      );
      await channel.ack(message);

      return createdCategory;
    } catch (err) {
      this.logger.error(`Error: ${JSON.stringify(err.message)}`);
      if (ackErrors.includes(err.code)) {
        await channel.ack(message);
      }

      throw new RpcException(err.message);
    }
  }

  @MessagePattern('update-category')
  async updateCategory(
    @Payload() updateCategoryDTO: updateCategoryDTO,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    this.logger.verbose(`category ${JSON.stringify(updateCategoryDTO)}`);

    const category = await this.categoriesService.updateCategory(
      updateCategoryDTO,
    );

    channel.ack(message);

    return category;
  }
}
