import { Category } from 'src/categories/interfaces/category.interface';

export interface Player {
  readonly _id: string;
  readonly phoneNumber: string;
  readonly email: string;
  category: Category;
  name: string;
  ranking: string;
  position: number;
  avatarUrl: string;
}
