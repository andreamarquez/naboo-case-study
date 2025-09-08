import { UserRole } from '../enums/user-role.enum';

describe('UserRole Enum', () => {
  it('should have ADMIN and USER roles', () => {
    expect(UserRole.ADMIN).toBe('admin');
    expect(UserRole.USER).toBe('user');
  });

  it('should have exactly 2 role types', () => {
    const roles = Object.values(UserRole);
    expect(roles).toHaveLength(2);
    expect(roles).toContain('admin');
    expect(roles).toContain('user');
  });
});
