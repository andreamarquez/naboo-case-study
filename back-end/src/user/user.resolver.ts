import { Resolver, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './user.schema';
import { Activity } from '../activity/activity.schema';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { ContextWithJWTPayload } from '../auth/types/context';
import { AddToFavouritesInput, RemoveFromFavouritesInput, ReorderFavouritesInput } from './dto/favourites.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async addToFavourites(
    @Context() context: ContextWithJWTPayload,
    @Args('input') input: AddToFavouritesInput,
  ): Promise<User> {
    const userId = context.jwtPayload.id;
    return this.userService.addToFavourites(userId, input.activityId);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async removeFromFavourites(
    @Context() context: ContextWithJWTPayload,
    @Args('input') input: RemoveFromFavouritesInput,
  ): Promise<User> {
    const userId = context.jwtPayload.id;
    return this.userService.removeFromFavourites(userId, input.activityId);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async reorderFavourites(
    @Context() context: ContextWithJWTPayload,
    @Args('input') input: ReorderFavouritesInput,
  ): Promise<User> {
    const userId = context.jwtPayload.id;
    return this.userService.reorderFavourites(userId, input.activityIds);
  }

  @ResolveField(() => [Activity])
  async favouriteActivities(@Parent() user: User): Promise<Activity[]> {
    return this.userService.getFavouriteActivities(user.id);
  }
}
