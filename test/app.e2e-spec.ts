import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
// import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto/edit-user.dto';
// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // since the app bootstraps with this in main.ts, we also need it for the tests
    // for calss validation from the ValidationPipe to work
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // init just creates the application context, not the server with the API, so we also need listen
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: 'password1234',
    };

    describe('Signup', () => {
      it('should throw if email empty', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', async () => {
        return await pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.email })
          .expectStatus(400);
      });

      it('should throw if body empty', async () => {
        return await pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should allow a user to sign up', async () => {
        return await pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password empty', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.email })
          .expectStatus(400);
      });

      it('should throw if body empty', async () => {
        return await pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should allow a user to sign in', async () => {
        return await pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('should be able to GET current user', async () => {
        return await pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .get('/users/me')
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should be able to EDIT current user', async () => {
        const dto: EditUserDto = {
          firstName: 'Test',
          email: 'notTest@test.com',
        };
        return await pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .patch('/users')
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmark', () => {
    describe('should be able to GET bookmarks', () => {});
    describe('should be able to GET a bookmark by id', () => {});
    describe('should be able to CREATE a bookmark', () => {});
    describe('should be able to UPDATE a bookmark by id', () => {});
    describe('should be able to DELETE a bookmark by id', () => {});
  });
});
