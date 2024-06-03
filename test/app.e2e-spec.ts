import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      username: 'test@example.com',
      password: 'testpassword',
      age: 10,
    });
    expect(res.status).toBe(HttpStatus.CREATED);
  });

  it('/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'test@example.com', password: 'testpassword' });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toHaveProperty('access_token');
    authToken = res.body.access_token;
  });

  it('/users/activate-mod (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/activate-mod')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(res.status).toBe(HttpStatus.OK);
  });

  it('/movies (POST)', () => {
    return request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Movie', minimumAge: 12, sessions: [] })
      .expect(201);
  });

  it('/movies (GET)', async () => {
    return request(app.getHttpServer())
      .get('/movies')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('/movies/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/movies/1')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Movie', minimumAge: 15 })
      .expect(200);
  });

  it('/movies/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/movies/1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });
});
