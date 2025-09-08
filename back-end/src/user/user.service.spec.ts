import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { randomUUID } from 'crypto';
import { TestModule, closeInMongodConnection } from 'src/test/test.module';
import { ActivityService } from '../activity/activity.service';
import { ActivityModule } from '../activity/activity.module';
import { User } from './user.schema';
import { Activity } from '../activity/activity.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let activityService: ActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestModule, UserModule, ActivityModule],
    }).compile();

    userService = module.get<UserService>(UserService);
    activityService = module.get<ActivityService>(ActivityService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('basic create / get', async () => {
    const email = randomUUID() + '@test.com';
    const user = await userService.createUser({
      email,
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const fetchedUser = await userService.getById(user.id);

    expect(fetchedUser).toMatchObject({
      email,
      firstName: 'firstName',
      lastName: 'lastName',
    });
  });

  describe('Favourites', () => {
    let testUser: User;
    let testActivities: Activity[];

    beforeEach(async () => {
      // Create test user
      const email = randomUUID() + '@test.com';
      testUser = await userService.createUser({
        email,
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      // Create test activities
      testActivities = await Promise.all([
        activityService.create(testUser.id, {
          name: 'Test Activity 1',
          city: 'Paris',
          price: 50,
          description: 'Test description 1',
        }),
        activityService.create(testUser.id, {
          name: 'Test Activity 2',
          city: 'Lyon',
          price: 75,
          description: 'Test description 2',
        }),
        activityService.create(testUser.id, {
          name: 'Test Activity 3',
          city: 'Nice',
          price: 100,
          description: 'Test description 3',
        }),
      ]);
    });

    describe('addToFavourites', () => {
      it('should add activity to empty favourites list', async () => {
        // Given: User with no favourites and valid activity
        const activityId = testActivities[0].id;
        
        // When: addToFavourites is called
        const updatedUser = await userService.addToFavourites(testUser.id, activityId);
        
        // Then: Activity should be added to favourites array
        expect(updatedUser.favourites).toHaveLength(1);
        expect(updatedUser.favourites[0].toString()).toBe(activityId);
      });

      it('should add activity to existing favourites list', async () => {
        // Given: User with existing favourites and new valid activity
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        
        // When: addToFavourites is called with second activity
        const updatedUser = await userService.addToFavourites(testUser.id, testActivities[1].id);
        
        // Then: Activity should be appended to favourites array
        expect(updatedUser.favourites).toHaveLength(2);
        expect(updatedUser.favourites[0].toString()).toBe(testActivities[0].id);
        expect(updatedUser.favourites[1].toString()).toBe(testActivities[1].id);
      });

      it('should not add duplicate activity to favourites', async () => {
        // Given: User with activity already in favourites
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        
        // When: addToFavourites is called with same activity
        // Then: Should throw error and favourites unchanged
        await expect(
          userService.addToFavourites(testUser.id, testActivities[0].id)
        ).rejects.toThrow(BadRequestException);
      });

      it('should throw error for non-existent activity', async () => {
        // Given: User and invalid activity ID
        const invalidActivityId = '507f1f77bcf86cd799439011';
        
        // When: addToFavourites is called
        // Then: Should throw NotFoundException
        await expect(
          userService.addToFavourites(testUser.id, invalidActivityId)
        ).rejects.toThrow(NotFoundException);
      });

      it('should throw error for non-existent user', async () => {
        // Given: Invalid user ID and valid activity
        const invalidUserId = '507f1f77bcf86cd799439011';
        
        // When: addToFavourites is called
        // Then: Should throw NotFoundException
        await expect(
          userService.addToFavourites(invalidUserId, testActivities[0].id)
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('removeFromFavourites', () => {
      it('should remove activity from favourites list', async () => {
        // Given: User with activity in favourites
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        
        // When: removeFromFavourites is called
        const updatedUser = await userService.removeFromFavourites(testUser.id, testActivities[0].id);
        
        // Then: Activity should be removed from favourites array
        expect(updatedUser.favourites).toHaveLength(0);
      });

      it('should maintain order when removing middle item', async () => {
        // Given: User with [A, B, C] in favourites
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        await userService.addToFavourites(testUser.id, testActivities[1].id);
        await userService.addToFavourites(testUser.id, testActivities[2].id);
        
        // When: removeFromFavourites is called for B
        const updatedUser = await userService.removeFromFavourites(testUser.id, testActivities[1].id);
        
        // Then: Favourites should be [A, C] in correct order
        expect(updatedUser.favourites).toHaveLength(2);
        expect(updatedUser.favourites[0].toString()).toBe(testActivities[0].id);
        expect(updatedUser.favourites[1].toString()).toBe(testActivities[2].id);
      });

      it('should handle removing non-existent favourite gracefully', async () => {
        // Given: User with favourites not containing activity
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        
        // When: removeFromFavourites is called for activity not in favourites
        const updatedUser = await userService.removeFromFavourites(testUser.id, testActivities[1].id);
        
        // Then: Should not throw error, favourites unchanged
        expect(updatedUser.favourites).toHaveLength(1);
        expect(updatedUser.favourites[0].toString()).toBe(testActivities[0].id);
      });

      it('should throw error for non-existent user', async () => {
        // Given: Invalid user ID
        const invalidUserId = '507f1f77bcf86cd799439011';
        
        // When: removeFromFavourites is called
        // Then: Should throw NotFoundException
        await expect(
          userService.removeFromFavourites(invalidUserId, testActivities[0].id)
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('reorderFavourites', () => {
      it('should reorder favourites to new order', async () => {
        // Given: User with [A, B, C] in favourites
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        await userService.addToFavourites(testUser.id, testActivities[1].id);
        await userService.addToFavourites(testUser.id, testActivities[2].id);
        
        // When: reorderFavourites is called with [C, A, B]
        const newOrder = [testActivities[2].id, testActivities[0].id, testActivities[1].id];
        const updatedUser = await userService.reorderFavourites(testUser.id, newOrder);
        
        // Then: Favourites should be [C, A, B]
        expect(updatedUser.favourites.map(id => id.toString())).toEqual(newOrder);
      });

      it('should throw error if activity IDs don\'t match favourites', async () => {
        // Given: User with [A, B] in favourites
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        await userService.addToFavourites(testUser.id, testActivities[1].id);
        
        // When: reorderFavourites is called with [A, B, C]
        const invalidOrder = [testActivities[0].id, testActivities[1].id, testActivities[2].id];
        
        // Then: Should throw BadRequestException
        await expect(
          userService.reorderFavourites(testUser.id, invalidOrder)
        ).rejects.toThrow(BadRequestException);
      });

      it('should throw error for missing activity IDs', async () => {
        // Given: User with [A, B, C] in favourites
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        await userService.addToFavourites(testUser.id, testActivities[1].id);
        await userService.addToFavourites(testUser.id, testActivities[2].id);
        
        // When: reorderFavourites is called with [A, B]
        const incompleteOrder = [testActivities[0].id, testActivities[1].id];
        
        // Then: Should throw BadRequestException
        await expect(
          userService.reorderFavourites(testUser.id, incompleteOrder)
        ).rejects.toThrow(BadRequestException);
      });

      it('should handle empty favourites list', async () => {
        // Given: User with no favourites
        // When: reorderFavourites is called with empty array
        const updatedUser = await userService.reorderFavourites(testUser.id, []);
        
        // Then: Should succeed with no changes
        expect(updatedUser.favourites).toHaveLength(0);
      });
    });

    describe('getFavouriteActivities', () => {
      it('should return favourite activities in correct order', async () => {
        // Given: User with ordered favourites [A, B, C]
        await userService.addToFavourites(testUser.id, testActivities[0].id);
        await userService.addToFavourites(testUser.id, testActivities[1].id);
        await userService.addToFavourites(testUser.id, testActivities[2].id);
        
        // When: getFavouriteActivities is called
        const favouriteActivities = await userService.getFavouriteActivities(testUser.id);
        
        // Then: Should return populated activities in [A, B, C] order
        expect(favouriteActivities).toHaveLength(3);
        expect(favouriteActivities[0].id.toString()).toBe(testActivities[0].id);
        expect(favouriteActivities[1].id.toString()).toBe(testActivities[1].id);
        expect(favouriteActivities[2].id.toString()).toBe(testActivities[2].id);
      });

      it('should return empty array for user with no favourites', async () => {
        // Given: User with no favourites
        // When: getFavouriteActivities is called
        const favouriteActivities = await userService.getFavouriteActivities(testUser.id);
        
        // Then: Should return empty array
        expect(favouriteActivities).toHaveLength(0);
      });

      it('should throw error for non-existent user', async () => {
        // Given: Invalid user ID
        const invalidUserId = '507f1f77bcf86cd799439011';
        
        // When: getFavouriteActivities is called
        // Then: Should throw NotFoundException
        await expect(
          userService.getFavouriteActivities(invalidUserId)
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
