import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/categories/category.interface';
import { Player } from './interfaces/players/player.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find();
  }

  async getCategory(_id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id });

    if (!category) {
      throw new RpcException(`Category with ID "${_id}" not found`);
    }

    return category;
  }

  async createCategory(category: Category): Promise<Category> {
    const createdCategory = new this.categoryModel(category);
    return createdCategory.save();
  }
}
