import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { updateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/categories/category.interface';

const ackErrors: number[] = [11000];

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @MessagePattern('get-categories')
  async getCategories(@Ctx() context: RmqContext): Promise<Category[]> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    await channel.ack(message);
    return this.appService.getCategories();
  }

  @MessagePattern('get-category')
  async getCategory(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Category> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    await channel.ack(message);
    return this.appService.getCategory(_id);
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
      const createdCategory = await this.appService.createCategory(category);
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

    const category = await this.appService.updateCategory(updateCategoryDTO);

    channel.ack(message);

    return category;
  }
}
