import { UserRole } from '../../user/enums/user-role.enum';

export type PayloadDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};
