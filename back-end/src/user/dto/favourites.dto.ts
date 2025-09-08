import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator';

@InputType()
export class AddToFavouritesInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  activityId!: string;
}

@InputType()
export class RemoveFromFavouritesInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  activityId!: string;
}

@InputType()
export class ReorderFavouritesInput {
  @Field(() => [ID])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  activityIds!: string[];
}
