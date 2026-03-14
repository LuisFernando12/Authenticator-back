import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { LoginDTO } from '../../../src/dto/login.dto';
import {
  OauthAuthorizeDTO,
  OauthTokenDTO,
} from '../../../src/dto/oauth-authorize.dto';
import { OauthError } from '../../../src/errors/oauth.error';
import { AppConfigEnvService } from '../../../src/service/app-config-env.service';
import { ClientService } from '../../../src/service/client.service';
import {
  IOauthService,
  OauthService,
} from '../../../src/service/oauth.service';
import { RedisService } from '../../../src/service/redis.service';
import { TokenService } from '../../../src/service/token.service';
import { UserClientConsentService } from '../../../src/service/user-client-consent.service';
import { UserService } from '../../../src/service/user.service';
import { mockAppconfigEnvService } from './mock/appConfigEnv.mock';
import { mockClientService } from './mock/client.mock';
import { mockRedisService } from './mock/redis.mock';
import { mockTokenService } from './mock/token.mock';
import { mockUserService } from './mock/user.mock';
import { mockUserClientConsentService } from './mock/userClient.mock';

describe('OauthService', () => {
  let oauthService: IOauthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ClientService,
          useValue: mockClientService,
        },
        OauthService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: AppConfigEnvService,
          useValue: mockAppconfigEnvService,
        },
        {
          provide: UserClientConsentService,
          useValue: mockUserClientConsentService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();
    oauthService = module.get<OauthService>(OauthService);
  });
  it('should be defined', () => {
    expect(oauthService).toBeDefined();
  });
  describe('authorize', () => {
    const payloadOauth: OauthAuthorizeDTO = {
      responseType: 'code',
      clientId: 'client-id',
      codeChallenge: 'code-challenge',
      codeChallengeMethod: 'sha256',
      redirectUri: 'http://localhost:3000/callback',
      state: 'state',
      scope: 'scope 1 scope 2',
    };
    const mockClient = {
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUris: ['http://localhost:3000/callback'],
      isConfidential: false,
    };
    it('should authorize user', async () => {
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const result = await oauthService.authorize(payloadOauth);
      expect(result).toBeInstanceOf(URL);
    });
    it('should throw an error to authorize missing code challenge method or code challenge', async () => {
      payloadOauth.codeChallengeMethod = undefined;
      const promise = oauthService.authorize(payloadOauth);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Code challenge and code challenge method are required together',
      );
    });
    it('should throw an error to authorize code challenge method not supported', async () => {
      payloadOauth.codeChallengeMethod = 'md5';
      const promise = oauthService.authorize(payloadOauth);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Code challenge method not supported',
      );
    });
    it('should throw an error to authorize client id not found', async () => {
      payloadOauth.codeChallengeMethod = 'sha256';
      mockClientService.findByClientId = jest.fn().mockResolvedValueOnce(null);
      const promise = oauthService.authorize(payloadOauth);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('ClientID authentication failed');
    });
    it('should throw an error to authorize redirect uri not found', async () => {
      payloadOauth.redirectUri = 'http://localhost:3000/callback2';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.authorize(payloadOauth);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Redirect URI not found');
    });
    it('should throw an error to authorize code challenge is required', async () => {
      payloadOauth.redirectUri = 'http://localhost:3000/callback';
      payloadOauth.codeChallenge = undefined;
      payloadOauth.codeChallengeMethod = undefined;
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.authorize(payloadOauth);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Code challenge is required');
    });
  });
  describe('token', () => {
    const payloadOauthToken: OauthTokenDTO = {
      grantType: 'authorization_code',
      clientId: 'client-id',
      codeVerifier: null,
      code: 'code',
      clientSecret: 'client-secret',
      redirectUri: 'http://localhost:3000/callback',
    };
    const mockClient = {
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUris: ['http://localhost:3000/callback'],
      isConfidential: false,
    };
    const mockUser = {
      id: 'id-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      isVerified: true,
    };
    const mockCode = JSON.stringify({
      code: 'code',
      userEmail: 'email',
      scope: 'scope',
      clientId: 'client-id',
      redirectUri: 'http://localhost:3000/callback',
    });
    const mockToken = {
      access_token: 'access_token',
      expiresAt: 'expiresAt',
    };
    const mockTokenResponse = {
      token_type: 'Bearer',
      access_token: 'access_token',
      scope: 'scope',
      expiresAt: 'expiresAt',
    };
    it('should retrun a token to authorization code flow', async () => {
      mockClient.isConfidential = true;
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockRedisService.getdel = jest.fn().mockResolvedValueOnce(mockCode);
      mockTokenService.generateToken = jest
        .fn()
        .mockResolvedValueOnce(mockToken);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      const result = await oauthService.token(payloadOauthToken);
      expect(result).toEqual(mockTokenResponse);
    });
    it('should return a token to PKCE flow', async () => {
      payloadOauthToken.codeVerifier = 'code-verifier';
      mockClient.isConfidential = false;
      const hashCodeVerifier = createHash('sha256')
        .update('code-verifier')
        .digest('base64url');
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);

      jest
        .spyOn(mockRedisService, 'getdel')
        .mockResolvedValueOnce(hashCodeVerifier)
        .mockResolvedValueOnce('sha256')
        .mockResolvedValueOnce(mockCode);

      mockTokenService.generateToken = jest
        .fn()
        .mockResolvedValueOnce(mockToken);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      const result = await oauthService.token(payloadOauthToken);
      expect(result).toEqual(mockTokenResponse);
    });
    it('should throw an error to client secret or code verifier is required', async () => {
      payloadOauthToken.clientSecret = undefined;
      payloadOauthToken.codeVerifier = undefined;
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Client secret or code verifier is required',
      );
    });
    it('should throw an error to client id not found', async () => {
      payloadOauthToken.codeVerifier = 'code-verifier';
      mockClientService.findByClientId = jest.fn().mockResolvedValueOnce(null);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('ClientID not found');
    });
    it('should throw an error to Client secret is required', async () => {
      mockClient.isConfidential = true;
      payloadOauthToken.clientSecret = null;
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Client secret is required');
    });
    it('should throw an  error to code verifier is required', async () => {
      mockClient.isConfidential = false;
      payloadOauthToken.clientSecret = 'client-secret';
      payloadOauthToken.codeVerifier = null;
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Code verifier is required');
    });
    it('should throw an error to invalid client secret', async () => {
      mockClient.isConfidential = true;
      payloadOauthToken.clientSecret = 'invalid-client-secret';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid client secret');
    });
    it('should throw an error to invalid redirect uri', async () => {
      payloadOauthToken.clientSecret = 'client-secret';
      payloadOauthToken.redirectUri = 'http://localhost:3000/callback2';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid redirect URI');
    });
    it('should throw an error to code challenge method not supported', async () => {
      payloadOauthToken.codeVerifier = 'code-verifier';
      payloadOauthToken.redirectUri = 'http://localhost:3000/callback';
      const hashCodeVerifier = createHash('sha256')
        .update('code-verifier')
        .digest('base64url');
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);

      jest
        .spyOn(mockRedisService, 'getdel')
        .mockResolvedValueOnce(hashCodeVerifier)
        .mockResolvedValueOnce('md5');

      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid code challenge method');
      // expect(result).toEqual(mockTokenResponse);
    });
    it('should throw an error to code challenge is invalid or expired', async () => {
      payloadOauthToken.redirectUri = 'http://localhost:3000/callback';
      payloadOauthToken.codeVerifier = 'code-verifier';
      payloadOauthToken.grantType = 'authorization_code';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockRedisService.getdel = jest.fn().mockResolvedValueOnce(false);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid code challenge');
    });
    it('should throw an error to Invalid code verifier', async () => {
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockRedisService.getdel = jest
        .fn()
        .mockResolvedValueOnce('code-challenge');
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid code verifier');
    });
    it('should throw an error to authorization code is invalid or expired', async () => {
      payloadOauthToken.codeVerifier = null;
      payloadOauthToken.code = 'invalid-code';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockRedisService.getdel = jest.fn().mockResolvedValueOnce(mockCode);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Authorization code is invalid or expired',
      );
    });
    it('should throw an error to invalid client id', async () => {
      payloadOauthToken.code = 'code';
      payloadOauthToken.clientId = 'invalid-client';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockRedisService.getdel = jest.fn().mockResolvedValueOnce(mockCode);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid client ID');
    });
    it('should thrown an error to invalid redirect uri', async () => {
      //
      payloadOauthToken.clientId = 'client-id';
      payloadOauthToken.redirectUri = 'http://localhost:3000/callback';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const { redirectURI: _, ...selfCode } = JSON.parse(mockCode);
      selfCode['redirectUri'] = 'http://localhost:3000/callback2';

      mockRedisService.getdel = jest
        .fn()
        .mockResolvedValueOnce(JSON.stringify(selfCode));
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid redirect URI');
    });
    it('should  throw an error to invalid user ', async () => {
      payloadOauthToken.redirectUri = 'http://localhost:3000/callback';
      mockRedisService.getdel = jest.fn().mockResolvedValueOnce(mockCode);
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(null);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid credentials');
    });
    it('should throw an error to generate token', async () => {
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      mockRedisService.getdel = jest.fn().mockResolvedValueOnce(mockCode);
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce(null);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(InternalServerErrorException);
      await expect(promise).rejects.toThrow('Failure to generate token');
    });
    it('should throw an error to unsupported grant type', async () => {
      payloadOauthToken.grantType = 'invalid-grant-type';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      const promise = oauthService.token(payloadOauthToken);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Unsupported grant type invalid-grant-type',
      );
    });
  });
  describe('login', () => {
    const payloadOauthLogin: LoginDTO = {
      email: 'email',
      password: 'password123',
    };
    const queryOauthLogin: OauthAuthorizeDTO = {
      responseType: 'code',
      clientId: 'client-id',
      codeChallenge: 'code-challenge',
      codeChallengeMethod: 'sha256',
      redirectUri: 'http://localhost:3000/callback',
      state: 'state',
      scope: 'scope 1 scope 2',
    };
    const mockClient = {
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUris: ['http://localhost:3000/callback'],
      isConfidential: false,
    };
    const mockUser = {
      id: 'id-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: bcrypt.hashSync('password123', bcrypt.genSaltSync()),
      isVerified: true,
    };
    it('should login user', async () => {
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      jest
        .spyOn(mockRedisService, 'set')
        .mockResolvedValueOnce('code')
        .mockResolvedValueOnce('code-challenge')
        .mockResolvedValueOnce('code-challenge-method');
      mockUserClientConsentService.create = jest
        .fn()
        .mockResolvedValueOnce(true);
      const result = await oauthService.login(
        payloadOauthLogin,
        queryOauthLogin,
      );
      expect(result).toBeInstanceOf(URL);
    });
    it('should throw an error to client id not found', async () => {
      mockClientService.findByClientId = jest.fn().mockResolvedValueOnce(null);

      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('ClientID not found');
    });
    it('should throw an error to redirect uri not found', async () => {
      queryOauthLogin.redirectUri = 'http://localhost:3000/callback2';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);

      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Redirect URI not found');
    });
    it('should throw an error to invalid credentials', async () => {
      queryOauthLogin.redirectUri = 'http://localhost:3000/callback';
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(null);

      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid credentials');
    });
    it('should throw an error to invalid credentials on password mismatached', async () => {
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      payloadOauthLogin.password = 'invalid-password';

      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow('Invalid credentials');
    });
    it('should throw an error to user not verified', async () => {
      mockUser.isVerified = false;
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      payloadOauthLogin.password = 'password123';

      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Please verify your email and active your account',
      );
    });
    it('should throw an error to save code on redis', async () => {
      mockUser.isVerified = true;
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      mockRedisService.set = jest.fn().mockResolvedValueOnce(false);
      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(InternalServerErrorException);
      await expect(promise).rejects.toThrow('Failure to save code on redis');
    });
    it('should throw an error to code challenge method not supported', async () => {
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      mockRedisService.set = jest.fn().mockResolvedValueOnce(true);
      queryOauthLogin.codeChallengeMethod = 'md5';
      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Code challenge method not supported',
      );
    });
    it('should throw an error to user consent to client', async () => {
      mockUserClientConsentService.create = jest
        .fn()
        .mockResolvedValueOnce(null);
      mockClientService.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(mockClient);
      mockUserService.findByEmail = jest.fn().mockResolvedValueOnce(mockUser);
      jest
        .spyOn(mockRedisService, 'set')
        .mockResolvedValueOnce('code')
        .mockResolvedValueOnce('code-challenge')
        .mockResolvedValueOnce('code-challenge-method');
      queryOauthLogin.codeChallengeMethod = 'sha256';
      const promise = oauthService.login(payloadOauthLogin, queryOauthLogin);
      await expect(promise).rejects.toThrow(OauthError);
      await expect(promise).rejects.toThrow(
        'Failure to user consent to client',
      );
    });
  });
});
