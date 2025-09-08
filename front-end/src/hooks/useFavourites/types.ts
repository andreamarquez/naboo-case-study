import { ActivityFragment } from "@/graphql/generated/types";

export interface UseFavouritesReturn {
  favourites: string[];
  favouriteActivities: ActivityFragment[];
  isFavourite: (activityId: string) => boolean;
  addToFavourites: (activityId: string) => Promise<void>;
  removeFromFavourites: (activityId: string) => Promise<void>;
  reorderFavourites: (orderedIds: string[]) => Promise<void>;
  isLoading: (activityId?: string) => boolean;
  error: string | null;
}
