import { Title } from '@mantine/core';

interface FavouritesHeaderProps {
  count: number;
}

export function FavouritesHeader({ count }: FavouritesHeaderProps) {
  return (
    <Title order={3} mb="lg">
      Mes Favoris {count > 0 && `(${count})`}
    </Title>
  );
}
