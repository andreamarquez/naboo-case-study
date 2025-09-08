import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useFavourites } from '@/hooks';
import { useAuth } from '@/hooks';
import { AuthPromptModal } from '../AuthPromptModal';

interface FavouriteButtonProps {
  activityId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'transparent' | 'white' | 'default';
  color?: string;
}

export function FavouriteButton({ 
  activityId, 
  size = 'md',
  variant = 'transparent',
  color = 'red'
}: FavouriteButtonProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Only use favourites hook if user is authenticated
  const favouritesHook = useFavourites();
  
  // For unauthenticated users, all activities are not favourites
  const isFav = user ? favouritesHook.isFavourite(activityId) : false;
  const isActionLoading = user ? favouritesHook.isLoading(activityId) : false;

  const handleClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isFav) {
      favouritesHook.removeFromFavourites(activityId);
    } else {
      favouritesHook.addToFavourites(activityId);
    }
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };

  return (
    <>
      <Tooltip
        label={
          !user 
            ? "Connectez-vous pour sauvegarder vos favoris" 
            : isFav 
              ? "Retirer des favoris" 
              : "Ajouter aux favoris"
        }
        position="bottom"
        withArrow
      >
        <ActionIcon
          variant={variant}
          color={isFav ? color : 'gray'}
          size={size}
          loading={isActionLoading}
          onClick={handleClick}
          aria-label={
            !user 
              ? "Connectez-vous pour sauvegarder vos favoris" 
              : isFav 
                ? "Retirer des favoris" 
                : "Ajouter aux favoris"
          }
          sx={(theme) => ({
            color: isFav ? theme.colors.red[6] : theme.colors.gray[5],
            '&:hover': {
              backgroundColor: variant === 'transparent' ? 'transparent' : undefined,
              color: isFav ? theme.colors.red[7] : theme.colors.red[4],
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          })}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleClick();
            }
          }}
        >
          {isFav ? (
            <IconHeartFilled size={iconSizes[size]} />
          ) : (
            <IconHeart size={iconSizes[size]} />
          )}
        </ActionIcon>
      </Tooltip>

      <AuthPromptModal
        opened={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Connectez-vous pour sauvegarder vos activités favorites !"
      />
    </>
  );
}
