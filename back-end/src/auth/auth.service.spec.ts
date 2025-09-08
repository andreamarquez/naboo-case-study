import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/enums/user-role.enum';
import { PayloadDto } from './types/jwtPayload.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService Role Integration', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    getByEmail: jest.fn(),
    updateToken: jest.fn(),
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Login with Role', () => {
    it('should include user role in JWT token for regular user', async () => {
      const userCredentials = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      const mockUser = {
        id: 'user-id',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER
      };
      
      mockUserService.getByEmail.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('mock-token');
      mockUserService.updateToken.mockResolvedValue(undefined);
      
      await authService.signIn(userCredentials);
      
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER
      });
    });

    it('should include admin role in JWT token for admin user', async () => {
      const adminCredentials = {
        email: 'admin@example.com',
        password: 'adminpass'
      };
      
      const mockAdmin = {
        id: 'admin-id',
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpass', 10),
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      };
      
      mockUserService.getByEmail.mockResolvedValue(mockAdmin);
      mockJwtService.signAsync.mockResolvedValue('mock-admin-token');
      mockUserService.updateToken.mockResolvedValue(undefined);
      
      await authService.signIn(adminCredentials);
      
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: 'admin-id',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      });
    });
  });

  describe('generateToken', () => {
    it('should include role in token payload', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.ADMIN
      } as any;

      mockJwtService.signAsync.mockResolvedValue('mock-token');

      await authService.generateToken({ user: mockUser });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.ADMIN
      });
    });
  });
});
