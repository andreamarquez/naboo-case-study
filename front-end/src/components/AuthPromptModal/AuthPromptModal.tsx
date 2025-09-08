import { Modal, Text, Stack, Button, Divider } from '@mantine/core';
import { useRouter } from 'next/router';

interface AuthPromptModalProps {
  opened: boolean;
  onClose: () => void;
  message?: string;
}

export function AuthPromptModal({
  opened,
  onClose,
  message = "Connectez-vous pour sauvegarder vos activités favorites",
}: AuthPromptModalProps) {
  const router = useRouter();

  const handleSignIn = () => {
    onClose();
    router.push('/signin');
  };

  const handleSignUp = () => {
    onClose();
    router.push('/signup');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Authentification requise"
      size="sm"
      centered
      closeOnClickOutside
      closeOnEscape
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Stack spacing="md">
        <Text size="sm" color="dimmed" align="center">
          {message}
        </Text>

        <Stack spacing="sm">
          <Button 
            fullWidth 
            onClick={handleSignIn}
            variant="filled"
          >
            Se connecter
          </Button>
          
          <Button 
            fullWidth 
            onClick={handleSignUp}
            variant="outline"
            color="dark"
          >
            Créer un compte
          </Button>
        </Stack>

        <Divider />

        <Text size="xs" color="dimmed" align="center">
          Vous serez redirigé pour compléter l'authentification
        </Text>
      </Stack>
    </Modal>
  );
}
