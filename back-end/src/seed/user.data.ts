import { UserRole } from 'src/user/enums/user-role.enum';

export const user = {
  email: 'user1@test.fr',
  password: 'user1',
  firstName: 'John',
  lastName: 'Doe',
};

export const admin = {
  email: 'admin@test.fr',
  password: 'admin',
  firstName: 'Admin',
  lastName: 'Boss',
  role: UserRole.ADMIN,
};
