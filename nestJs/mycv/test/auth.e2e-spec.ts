import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setup } from '../src/setup'

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setup(app)
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'asasssss@ass.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'aaaa' })
      .expect(201)
      .then(res => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect( email).toEqual(email)
      })
  });
});
