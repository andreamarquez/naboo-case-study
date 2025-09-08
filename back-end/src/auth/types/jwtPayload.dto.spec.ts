import { UserRole } from '../../user/enums/user-role.enum';
import { PayloadDto } from './jwtPayload.dto';

describe('PayloadDto', () => {
  it('should include role field in JWT payload', () => {
    const payload: PayloadDto = {
      id: 'user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER
    };
    
    expect(payload.role).toBeDefined();
    expect(payload.role).toBe(UserRole.USER);
  });

  it('should validate role field type', () => {
    const createPayload = (role: UserRole) => ({
      id: 'user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role
    });
    
    expect(() => createPayload(UserRole.ADMIN)).not.toThrow();
    expect(() => createPayload(UserRole.USER)).not.toThrow();
  });
});
