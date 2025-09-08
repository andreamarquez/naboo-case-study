import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { Activity } from '../activity/activity.schema';
import { UserRole } from './enums/user-role.enum';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Field()
  @Prop({ required: true })
  firstName!: string;

  @Field()
  @Prop({ required: true })
  lastName!: string;

  @Field()
  @Prop({ required: true, unique: true })
  email!: string;

  // Improvement: Vulnerability, the password should not be exposed in responses
  // should remove @Field() decorator to fix it
  @Field()
  @Prop({ required: true })
  password!: string;

  @Prop()
  token?: string;

  // Favourites system: Store Activity ObjectIds to maintain order for reordering feature
  // This is the database storage field - array of Activity references (not exposed to GraphQL)
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    default: [],
  })
  favourites!: string[];

  // GraphQL virtual field - populated Activity objects via @ResolveField in resolver
  // Frontend gets full Activity data (name, city, price, etc.) and IDs via activity.id
  @Field(() => [Activity])
  favouriteActivities!: Activity[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Auth is one of the things that will happen most frequently
// and less frequent (or maybe same) but still used, the role checks for admin functionality
// UserSchema.index({ email: 1 }, { unique: true }); // Email lookup for auth
// UserSchema.index({ role: 1 }); // Admin functionality
// UserSchema.index({ favourites: 1 }); // For favourites queries
// UserSchema.index({ favourites: 1, _id: 1 }); // Compound index for user favourites
