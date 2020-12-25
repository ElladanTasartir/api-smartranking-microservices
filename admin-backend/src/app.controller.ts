import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

const ackErrors: number[] = [11000];

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
}
