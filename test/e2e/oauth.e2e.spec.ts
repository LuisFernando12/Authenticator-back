import { MailerService } from '@nestjs-modules/mailer';
import { ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'node:crypto';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { OauthAuthorizeDTO } from '../../src/dto/oauth-authorize.dto';
import { AppConfigModule } from '../../src/module/app-config.module';
import { AppModule } from '../../src/module/app.module';
import { EmailModule } from '../../src/module/email.module';
import { AppConfigEnvSetup } from './setup/app-config-env.setup';
import { DatabaseSetup } from './setup/database.setup';
import { TestAppConfigModule } from './setup/test-app-config.module';
import { TestEmailModule } from './setup/test-email.module';

describe('Oauth E2E Test', () => {
  let databaseSetup: DatabaseSetup;

  let app: NestApplication;

  beforeAll(async () => {
    databaseSetup = new DatabaseSetup();
    await databaseSetup.setup();
    const { postgresService, redisContainer } = databaseSetup;
    await new AppConfigEnvSetup().setup(postgresService, redisContainer);

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(AppConfigModule)
      .useModule(TestAppConfigModule)
      .overrideModule(EmailModule)
      .useModule(TestEmailModule)
      .overrideProvider(MailerService)
      .useValue({
        sendMail: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.setGlobalPrefix('api/auth');
    await app.init();
    const dataSource = app.get(DataSource);
    await databaseSetup.seed(dataSource);
    app.getHttpServer();
  }, 60000);
  afterAll(async () => {
    if (app) await app.close();
    if (databaseSetup) await databaseSetup.teardown();
  }, 30000);
  const codeVerifier = crypto.randomBytes(16).toString();
  const codeChallangeMethod = 'sha256';
  const codeChallange = crypto
    .createHash(codeChallangeMethod)
    .update(codeVerifier)
    .digest('base64url');

  const clientId = 'test-client-id';
  const state = crypto.randomBytes(32).toString();
  const scope = 'openid';
  const clientSecret = 'test-client-secret';
  const redirectUri = 'http://localhost:4000/callback';
  const queryAuthorize: Required<Omit<OauthAuthorizeDTO, 'oauthRequestId'>> = {
    responseType: 'code',
    clientId: clientId,
    redirectUri: redirectUri,
    state: state,
    scope: scope,
    codeChallenge: codeChallange as unknown as string,
    codeChallengeMethod: codeChallangeMethod,
  };
  describe('PKCE Flow', () => {
    it('should successfully PKCE Flow ', async () => {
      const responseAuthorize = await request
        .agent(app.getHttpServer())
        .get('/api/auth/oauth/authorize')
        .query(queryAuthorize)
        .expect(302);
      let oauthRequestId: string;
      if (responseAuthorize.headers.location) {
        const url = new URL(responseAuthorize.headers.location);
        oauthRequestId = url.searchParams.get('oauthRequestId');
      }
      const responseLogin = await request
        .agent(app.getHttpServer())
        .post('/api/auth/oauth/login')
        .query({ ...queryAuthorize, oauthRequestId: oauthRequestId })
        .send({ email: 'john.doe@gmail.com', password: 'test1234' })
        .expect(302);
      let code: string;
      if (responseLogin.headers.location) {
        const url = new URL(responseLogin.headers.location);
        code = url.searchParams.get('code');
      }
      const reponseToken = await request
        .agent(app.getHttpServer())
        .post('/api/auth/oauth/token')
        .send({
          grantType: 'authorization_code',
          clientId: clientId,
          redirectUri: redirectUri,
          code: code,
          codeVerifier: codeVerifier,
          clientSecret: clientSecret,
        })
        .expect(201);
      expect(reponseToken.body).toEqual({
        access_token: expect.any(String),
        expiresAt: expect.any(String),
        refresh_token: expect.any(String),
        token_type: expect.any(String),
        scope: expect.any(String),
      });
    });
  });
  describe('Authorization Code Flow', () => {
    const queryAuthorize = {
      responseType: 'code',
      clientId,
      redirectUri,
      state,
      scope,
    };
    it('should successfully Authorization Code Flow ', async () => {
      const responseAuthorize = await request
        .agent(app.getHttpServer())
        .get('/api/auth/oauth/authorize')
        .query(queryAuthorize)
        .expect((res) => {
          if (res.status !== 302) {
            console.log('Error: ', JSON.stringify(res.body, null, 2));
          }
        })
        .expect(302);
      let oauthRequestId: string;
      if (responseAuthorize.headers.location) {
        const url = new URL(responseAuthorize.headers.location);
        oauthRequestId = url.searchParams.get('oauthRequestId');
      }
      const responseLogin = await request
        .agent(app.getHttpServer())
        .post('/api/auth/oauth/login')
        .query({
          ...queryAuthorize,
          oauthRequestId: oauthRequestId,
        })
        .send({
          email: 'john.doe@gmail.com',
          password: 'test1234',
        })
        .expect(302);
      let code: string;
      if (responseLogin.headers.location) {
        const url = new URL(responseLogin.headers.location);
        code = url.searchParams.get('code');
      }
      const reponseToken = await request
        .agent(app.getHttpServer())
        .post('/api/auth/oauth/token')
        .send({
          grantType: 'authorization_code',
          clientId,
          redirectUri,
          code,
          clientSecret,
        })
        .expect(201);
      expect(reponseToken.body).toEqual({
        access_token: expect.any(String),
        expiresAt: expect.any(String),
        refresh_token: expect.any(String),
        token_type: expect.any(String),
        scope: expect.any(String),
      });
    });
  });
});
