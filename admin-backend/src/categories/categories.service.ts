import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { updateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
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

  async updateCategory(
    updateCategoryDTO: updateCategoryDTO,
  ): Promise<Category> {
    const { id, category } = updateCategoryDTO;

    const foundCategory = await this.getCategory(id);

    foundCategory.description = category.description;
    foundCategory.events = category.events;

    return foundCategory.save();
  }
}
