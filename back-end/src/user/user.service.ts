import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from 'src/auth/types';
import { User } from './user.schema';
import { Activity } from '../activity/activity.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(
    data: SignUpInput & {
      role?: User['role'];
    },
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, password: hashedPassword });
    return user.save();
  }

  async updateToken(id: string, token: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.token = token;
    return user.save();
  }

  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async setDebugMode({
    userId,
    enabled,
  }: {
    userId: string;
    enabled: boolean;
  }): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        debugModeEnabled: enabled,
      },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Favourites functionality
  async addToFavourites(userId: string, activityId: string): Promise<User> {
    // Check if user exists
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if activity exists
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if activity is already in favourites (convert to strings for comparison)
    const favouriteIds = user.favourites.map(id => id.toString());
    if (favouriteIds.includes(activityId)) {
      throw new BadRequestException('Activity is already in favourites');
    }

    // Add activity to favourites
    user.favourites.push(activityId);
    return user.save();
  }

  async removeFromFavourites(userId: string, activityId: string): Promise<User> {
    // Check if user exists
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove activity from favourites (convert to strings for comparison)
    user.favourites = user.favourites.filter(id => id.toString() !== activityId);
    return user.save();
  }

  async reorderFavourites(userId: string, orderedActivityIds: string[]): Promise<User> {
    // Check if user exists
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle empty favourites
    if (user.favourites.length === 0 && orderedActivityIds.length === 0) {
      return user;
    }

    // Validate that provided IDs match current favourites (convert to strings for comparison)
    const currentFavourites = user.favourites.map(id => id.toString()).sort();
    const providedIds = [...orderedActivityIds].sort();
    
    if (currentFavourites.length !== providedIds.length ||
        !currentFavourites.every((id, index) => id === providedIds[index])) {
      throw new BadRequestException('Provided activity IDs do not match current favourites');
    }

    // Update favourites order
    user.favourites = orderedActivityIds;
    return user.save();
  }

  async getFavouriteActivities(userId: string): Promise<Activity[]> {
    // Check if user exists
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get activities in the order they appear in favourites
    if (user.favourites.length === 0) {
      return [];
    }

    const activities = await this.activityModel.find({
      _id: { $in: user.favourites }
    }).exec();

    // Sort activities by their position in the favourites array
    const activityMap = new Map(activities.map(activity => [activity._id.toString(), activity]));
    return user.favourites
      .map(id => activityMap.get(id.toString()))
      .filter(activity => activity !== undefined) as Activity[];
  }
}
