import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.schema';
import { Activity } from '../activity/activity.schema';

describe('UserResolver - Favourites', () => {
  let resolver: UserResolver;
  let userService: UserService;

  // Mock user and activities
  const mockUser: Partial<User> = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    favourites: ['activity-1', 'activity-2'],
  };

  const mockActivity: Partial<Activity> = {
    id: 'activity-1',
    name: 'Test Activity',
    city: 'Paris',
    price: 50,
    description: 'Test description',
  };

  const mockContext = {
    jwtPayload: {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
  };

  const mockUserService = {
    addToFavourites: jest.fn(),
    removeFromFavourites: jest.fn(),
    reorderFavourites: jest.fn(),
    getFavouriteActivities: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToFavourites', () => {
    it('should call userService.addToFavourites with correct params', async () => {
      // Given: Authenticated user context and activity ID
      const input = { activityId: 'activity-1' };
      mockUserService.addToFavourites.mockResolvedValue(mockUser);

      // When: addToFavourites mutation is called
      const result = await resolver.addToFavourites(mockContext, input);

      // Then: Should call service with userId and activityId
      expect(userService.addToFavourites).toHaveBeenCalledWith('user-1', 'activity-1');
      expect(result).toBe(mockUser);
    });

    it('should return updated user with new favourite', async () => {
      // Given: User and activity
      const input = { activityId: 'activity-1' };
      const updatedUser = { ...mockUser, favourites: ['activity-1'] };
      mockUserService.addToFavourites.mockResolvedValue(updatedUser);

      // When: addToFavourites mutation is called
      const result = await resolver.addToFavourites(mockContext, input);

      // Then: Should return user with activity in favourites
      expect(result.favourites).toContain('activity-1');
    });

    it('should propagate service errors', async () => {
      // Given: Service that throws error
      const input = { activityId: 'activity-1' };
      mockUserService.addToFavourites.mockRejectedValue(new BadRequestException('Activity already in favourites'));

      // When: addToFavourites mutation is called
      // Then: Should throw the same error
      await expect(resolver.addToFavourites(mockContext, input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeFromFavourites', () => {
    it('should call userService.removeFromFavourites with correct params', async () => {
      // Given: Authenticated user context and activity ID
      const input = { activityId: 'activity-1' };
      mockUserService.removeFromFavourites.mockResolvedValue(mockUser);

      // When: removeFromFavourites mutation is called
      const result = await resolver.removeFromFavourites(mockContext, input);

      // Then: Should call service with userId and activityId
      expect(userService.removeFromFavourites).toHaveBeenCalledWith('user-1', 'activity-1');
      expect(result).toBe(mockUser);
    });

    it('should return updated user without removed favourite', async () => {
      // Given: User with activity in favourites
      const input = { activityId: 'activity-1' };
      const updatedUser = { ...mockUser, favourites: ['activity-2'] };
      mockUserService.removeFromFavourites.mockResolvedValue(updatedUser);

      // When: removeFromFavourites mutation is called
      const result = await resolver.removeFromFavourites(mockContext, input);

      // Then: Should return user without activity in favourites
      expect(result.favourites).not.toContain('activity-1');
      expect(result.favourites).toContain('activity-2');
    });
  });

  describe('reorderFavourites', () => {
    it('should call userService.reorderFavourites with correct params', async () => {
      // Given: Authenticated user and ordered activity IDs
      const input = { activityIds: ['activity-2', 'activity-1'] };
      mockUserService.reorderFavourites.mockResolvedValue(mockUser);

      // When: reorderFavourites mutation is called
      const result = await resolver.reorderFavourites(mockContext, input);

      // Then: Should call service with userId and orderedIds
      expect(userService.reorderFavourites).toHaveBeenCalledWith('user-1', ['activity-2', 'activity-1']);
      expect(result).toBe(mockUser);
    });

    it('should propagate validation errors', async () => {
      // Given: Invalid input (mismatched activity IDs)
      const input = { activityIds: ['activity-3', 'activity-4'] };
      mockUserService.reorderFavourites.mockRejectedValue(
        new BadRequestException('Provided activity IDs do not match current favourites')
      );

      // When: reorderFavourites mutation is called
      // Then: Should throw ValidationException
      await expect(resolver.reorderFavourites(mockContext, input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('favouriteActivities field resolver', () => {
    it('should return populated favourite activities', async () => {
      // Given: User with favourites
      const mockActivities = [mockActivity] as Activity[];
      mockUserService.getFavouriteActivities.mockResolvedValue(mockActivities);

      // When: favouriteActivities field is resolved
      const result = await resolver.favouriteActivities(mockUser as User);

      // Then: Should return populated Activity objects in order
      expect(userService.getFavouriteActivities).toHaveBeenCalledWith('user-1');
      expect(result).toBe(mockActivities);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockActivity);
    });

    it('should handle user with no favourites', async () => {
      // Given: User with empty favourites
      const userWithNoFavourites = { ...mockUser, favourites: [] };
      mockUserService.getFavouriteActivities.mockResolvedValue([]);

      // When: favouriteActivities field is resolved
      const result = await resolver.favouriteActivities(userWithNoFavourites as User);

      // Then: Should return empty array
      expect(result).toHaveLength(0);
    });

    it('should propagate service errors', async () => {
      // Given: Service that throws error
      mockUserService.getFavouriteActivities.mockRejectedValue(new NotFoundException('User not found'));

      // When: favouriteActivities field is resolved
      // Then: Should throw the same error
      await expect(resolver.favouriteActivities(mockUser as User)).rejects.toThrow(NotFoundException);
    });
  });
});
