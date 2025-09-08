import { Badge } from '@mantine/core';

export function AdminBadge() {
  return (
    <Badge
      color="red"
      variant="filled"
      size='sm'
      data-testid="admin-badge"
    >
      Administrateur
    </Badge>
  );
}
