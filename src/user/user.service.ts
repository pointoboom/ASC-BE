import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

import { HttpException } from '@nestjs/common';
import { PaginateModel } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: PaginateModel<User>) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
      throw new HttpException('Invalid email format', 400);
    }
    if (await this.userModel.exists({ email: userData.email })) {
      throw new HttpException('Email already exists', 400);
    }
    if (typeof userData.age !== 'number' || userData.age <= 0) {
      throw new HttpException('Age must be a positive number', 400);
    }
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }
  async findAllUsers(q: string, start: number, limit: number) {
    return await this.userModel.paginate(
      {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      },
      {
        page: Math.ceil(start / limit) || 1, // Convert start to page number
        limit: limit,
      },
    );
  }
  async findUserById(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }
  async deleteUser(id: string): Promise<string | null> {
    if (!(await this.userModel.exists({ _id: id }))) {
      throw new HttpException('User not found', 404);
    }
    await this.userModel.findByIdAndDelete(id);

    return 'User deleted successfully';
  }
}
