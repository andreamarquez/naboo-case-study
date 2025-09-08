import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @Field(() => ID)
  id!: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role!: 'user' | 'admin';

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
}

export const UserSchema = SchemaFactory.createForClass(User);

// Auth is one of the things that will happen most frequently
// and less frequent (or maybe same) but still used, the role checks for admin functionality
// UserSchema.index({ email: 1 }, { unique: true }); // Email lookup for auth
// UserSchema.index({ role: 1 }); // Admin functionality
