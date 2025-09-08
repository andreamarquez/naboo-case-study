import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../user/user.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Activity extends Document {
  @Field(() => ID)
  id!: string;

  @Field()
  @Prop({ required: true })
  name!: string;

  @Field()
  @Prop({ required: true })
  city!: string;

  @Field()
  @Prop({ required: true })
  description!: string;

  @Field()
  @Prop({ required: true })
  price!: number;

  @Field(() => User)
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner!: User;

  @Field(() => Date, { nullable: true })
  createdAt!: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

// Optimize queries with Mongoose indexes
// ActivitySchema.index({ owner: 1, createdAt: -1 }); // for findByUser
// ActivitySchema.index({ createdAt: -1 }); // Latest activities, findLatest (Activity)
// for Activities by city queries:
// ActivitySchema.index({ city: 1, createdAt: -1 }); // City indexing with sort (newest first)
// ActivitySchema.index({ city: 1, price: 1 }); // City + price filtering
// ActivitySchema.index({ city: 1, name: 'text' }); // City + text search
