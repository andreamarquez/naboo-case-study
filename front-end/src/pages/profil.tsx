import { PageTitle, FavouritesList, AdminBadge } from "@/components";
import { graphqlClient } from "@/graphql/apollo";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Flex, Text, Stack, Divider, Card, Title, Group } from "@mantine/core";
import { GetServerSideProps } from "next";
import Head from "next/head";

interface ProfileProps {
  favoriteActivities: {
    id: string;
    name: string;
  }[];
}

const Profile = (props: ProfileProps) => {
  const { user, isAdmin } = useAuth();

  return (
    <>
      <Head>
        <title>Mon profil | CDTR</title>
      </Head>
      <PageTitle title="Mon profil" />
      
      <Stack spacing="xl">
        {/* User Information Section */}
        <Flex align="center" gap="md">
          <Avatar color="cyan" radius="xl" size="lg">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </Avatar>
          <Flex direction="column">
            <Group spacing="sm" align="center">
              <Text weight={500} size="lg">
                {user?.firstName} {user?.lastName}
              </Text>
              {isAdmin && <AdminBadge />}
            </Group>
            <Text color="dimmed">{user?.email}</Text>
          </Flex>
        </Flex>

        <Divider />

        {/* Favourites Section */}
        <FavouritesList />
      </Stack>
    </>
  );
};

export default withAuth(Profile);
