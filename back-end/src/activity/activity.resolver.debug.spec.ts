import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ActivityResolver } from './activity.resolver';
import { ActivityService } from './activity.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/enums/user-role.enum';

describe('Activity Resolver Debug Mode', () => {
  let resolver: ActivityResolver;
  let activityService: ActivityService;

  const mockActivityService = {
    findAll: jest.fn(),
    findLatest: jest.fn(),
    findByUser: jest.fn(),
    findCities: jest.fn(),
    findByCity: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockUserService = {
    // Add mock methods as needed
  };

  const mockActivities = [
    {
      id: '1',
      name: 'Activity 1',
      description: 'Description 1',
      city: 'Paris',
      price: 50,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      owner: { id: '1', firstName: 'John', lastName: 'Doe' }
    },
    {
      id: '2',
      name: 'Activity 2',
      description: 'Description 2',
      city: 'Lyon',
      price: 75,
      createdAt: new Date('2024-01-16T14:20:00Z'),
      owner: { id: '2', firstName: 'Jane', lastName: 'Smith' }
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityResolver,
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<ActivityResolver>(ActivityResolver);
    activityService = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActivitiesWithDebugInfo Query', () => {
    it('should return activities with debug info for admin users', async () => {
      mockActivityService.findAll.mockResolvedValue(mockActivities);

      const activities = await resolver.getActivitiesWithDebugInfo();
      
      expect(activities).toBeDefined();
      expect(Array.isArray(activities)).toBe(true);
      expect(activities).toHaveLength(2);
      activities.forEach(activity => {
        expect(activity.createdAt).toBeDefined();
        expect(activity.createdAt).toBeInstanceOf(Date);
      });
      expect(activityService.findAll).toHaveBeenCalled();
    });

    it('should call ActivityService.findAll method', async () => {
      mockActivityService.findAll.mockResolvedValue(mockActivities);

      await resolver.getActivitiesWithDebugInfo();
      
      expect(activityService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Regular getActivities Query', () => {
    it('should return activities for all users', async () => {
      mockActivityService.findAll.mockResolvedValue(mockActivities);

      const activities = await resolver.getActivities();
      
      expect(activities).toBeDefined();
      expect(Array.isArray(activities)).toBe(true);
      expect(activities).toHaveLength(2);
      activities.forEach(activity => {
        expect(activity.createdAt).toBeDefined();
      });
    });
  });
});
