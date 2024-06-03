import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

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

  it('/movies (GET)', () => {
    return request(app.getHttpServer()).get('/movies').expect(200);
  });

  it('/movies/:id (GET)', () => {
    return request(app.getHttpServer()).get('/movies/1').expect(200);
  });

  it('/movies (POST)', () => {
    return request(app.getHttpServer())
      .post('/movies')
      .send({ name: 'Test Movie', minimumAge: 12 })
      .expect(201);
  });

  it('/movies/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/movies/1')
      .send({ name: 'Updated Movie', minimumAge: 15 })
      .expect(200);
  });

  it('/movies/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/movies/1').expect(200);
  });

  it('/sessions (GET)', () => {
    return request(app.getHttpServer()).get('/sessions').expect(200);
  });

  it('/sessions/:id (GET)', () => {
    return request(app.getHttpServer()).get('/sessions/1').expect(200);
  });

  it('/sessions (POST)', () => {
    return request(app.getHttpServer())
      .post('/sessions')
      .send({
        date: new Date(),
        roomNumber: 1,
        timeSlot: '14:00-16:00',
        movieId: 1,
      })
      .expect(201);
  });

  it('/sessions/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/sessions/1').expect(200);
  });
});
