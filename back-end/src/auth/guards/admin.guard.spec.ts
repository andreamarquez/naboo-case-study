import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AdminGuard } from './admin.guard';
import { UserRole } from '../../user/enums/user-role.enum';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let mockExecutionContext: ExecutionContext;
  let mockGqlContext: any;

  beforeEach(() => {
    guard = new AdminGuard();
    
    mockGqlContext = {
      getContext: jest.fn().mockReturnValue({})
    };
    
    mockExecutionContext = {} as ExecutionContext;
    
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext);
  });

  describe('canActivate', () => {
    it('should allow access for admin users', () => {
      const mockContext = {
        jwtPayload: {
          id: 'admin-id',
          email: 'admin@example.com',
          role: UserRole.ADMIN
        }
      };
      
      mockGqlContext.getContext.mockReturnValue(mockContext);
      
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should deny access for regular users', () => {
      const mockContext = {
        jwtPayload: {
          id: 'user-id',
          email: 'user@example.com',
          role: UserRole.USER
        }
      };
      
      mockGqlContext.getContext.mockReturnValue(mockContext);
      
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should deny access for unauthenticated requests', () => {
      const mockContext = { jwtPayload: null };
      
      mockGqlContext.getContext.mockReturnValue(mockContext);
      
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should deny access for requests without jwtPayload', () => {
      const mockContext = {};
      
      mockGqlContext.getContext.mockReturnValue(mockContext);
      
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });

    it('should deny access for users without role', () => {
      const mockContext = {
        jwtPayload: {
          id: 'user-id',
          email: 'user@example.com'
          // No role field
        }
      };
      
      mockGqlContext.getContext.mockReturnValue(mockContext);
      
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(false);
    });
  });
});
