import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Debug Mode E2E Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Login as admin to get admin token
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(signInInput: {
              email: "admin@test.fr",
              password: "admin"
            }) {
              access_token
            }
          }
        `
      });

    adminToken = adminLoginResponse.body.data.login.access_token;

    // Login as regular user to get user token
    const userLoginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(signInInput: {
              email: "user1@test.fr",
              password: "user1"
            }) {
              access_token
            }
          }
        `
      });

    userToken = userLoginResponse.body.data.login.access_token;
  });

  describe('Admin User Flow', () => {
    it('should allow admin to access debug queries', async () => {
      const debugResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query: `
            query {
              getActivitiesWithDebugInfo {
                id
                name
                createdAt
              }
            }
          `
        });

      expect(debugResponse.status).toBe(200);
      expect(debugResponse.body.data.getActivitiesWithDebugInfo).toBeDefined();
      expect(Array.isArray(debugResponse.body.data.getActivitiesWithDebugInfo)).toBe(true);
      
      // Verify each activity has createdAt timestamp
      debugResponse.body.data.getActivitiesWithDebugInfo.forEach((activity: any) => {
        expect(activity.createdAt).toBeDefined();
        expect(activity.id).toBeDefined();
        expect(activity.name).toBeDefined();
      });
    });
  });

  describe('Regular User Flow', () => {
    it('should deny regular user access to debug queries', async () => {
      const debugResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          query: `
            query {
              getActivitiesWithDebugInfo {
                id
                name
                createdAt
              }
            }
          `
        });

      expect(debugResponse.status).toBe(200);
      expect(debugResponse.body.errors).toBeDefined();
      expect(debugResponse.body.errors[0].message).toContain('Forbidden');
    });

    it('should allow regular user access to normal activities query', async () => {
      const activitiesResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          query: `
            query {
              getActivities {
                id
                name
                createdAt
              }
            }
          `
        });

      expect(activitiesResponse.status).toBe(200);
      expect(activitiesResponse.body.data.getActivities).toBeDefined();
      expect(Array.isArray(activitiesResponse.body.data.getActivities)).toBe(true);
    });
  });

  describe('JWT Role Integration', () => {
    it('should include role in JWT for admin user', async () => {
      const meResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          query: `
            query {
              getMe {
                id
                email
                role
              }
            }
          `
        });

      expect(meResponse.status).toBe(200);
      expect(meResponse.body.data.getMe.role).toBe('admin');
    });

    it('should include role in JWT for regular user', async () => {
      const meResponse = await request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          query: `
            query {
              getMe {
                id
                email
                role
              }
            }
          `
        });

      expect(meResponse.status).toBe(200);
      expect(meResponse.body.data.getMe.role).toBe('user');
    });
  });

  describe('Unauthenticated Access', () => {
    it('should deny unauthenticated access to debug queries', async () => {
      const debugResponse = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              getActivitiesWithDebugInfo {
                id
                name
                createdAt
              }
            }
          `
        });

      expect(debugResponse.status).toBe(200);
      expect(debugResponse.body.errors).toBeDefined();
      expect(debugResponse.body.errors[0].message).toContain('Unauthorized');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
