import { Box, Text, Button, Center } from '@mantine/core';
import Link from 'next/link';
import { EmptyData } from '@/components';

interface EmptyFavouritesProps {
  isAuthenticated: boolean;
}

export function EmptyFavourites({ isAuthenticated }: EmptyFavouritesProps) {
  if (!isAuthenticated) {
    return (
      <Box py="xl">
        <Text align="center" color="dimmed">
          Connectez-vous pour voir vos activités favorites
        </Text>
      </Box>
    );
  }

  return (
    <Box py="xl">
      <EmptyData />
      <Center mt="md">
        <Link href="/discover">
          <Button variant="filled" color="blue">
            Découvrir des activités
          </Button>
        </Link>
      </Center>
    </Box>
  );
}
