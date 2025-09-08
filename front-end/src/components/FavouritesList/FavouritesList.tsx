import { Container, LoadingOverlay, Box } from '@mantine/core';
import { useFavourites } from '@/hooks';
import { useAuth } from '@/hooks';
import { FavouritesHeader } from './FavouritesHeader';
import { EmptyFavourites } from './EmptyFavourites';
import { FavouritesGrid } from './FavouritesGrid';

interface FavouritesListProps {
  userId?: string;
}

export function FavouritesList({ userId }: FavouritesListProps) {
  const { user } = useAuth();
  const { 
    favouriteActivities, 
    isLoading,
    error,
    reorderFavourites,
  } = useFavourites();

  const isAuthenticated = !!user;
  const loading = isLoading(); // Call the function to get loading state

  const handleReorder = async (orderedIds: string[]) => {
    try {
      await reorderFavourites(orderedIds);
    } catch (error) {
      console.error('Failed to reorder favourites:', error);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Box sx={{ position: 'relative', minHeight: 200 }}>
          <LoadingOverlay visible={loading} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <EmptyFavourites isAuthenticated={isAuthenticated} />
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <FavouritesHeader count={favouriteActivities.length} />

      {favouriteActivities.length === 0 ? (
        <EmptyFavourites isAuthenticated={isAuthenticated} />
      ) : (
        <FavouritesGrid
          activities={favouriteActivities}
          onReorder={handleReorder}
        />
      )}
    </Container>
  );
}
