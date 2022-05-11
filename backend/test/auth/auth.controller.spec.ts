import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import AuthController from '../../src/modules/auth/controller/auth.controller';
import mockedUser from '../../src/libs/test-utils/mocks/user.mock';
import jwtService from '../../src/libs/test-utils/mocks/jwtService.mock';
import configService from '../../src/libs/test-utils/mocks/configService.mock';
import {
  getTokenAuthApplication,
  getTokenAuthService,
  registerAuthApplication,
  registerAuthService,
} from '../../src/modules/auth/auth.providers';
import {
  createUserService,
  getUserApplication,
  getUserService,
  updateUserService,
} from '../../src/modules/users/users.providers';
import {
  getTeamApplication,
  getTeamService,
} from '../../src/modules/teams/providers';
import {
  getBoardApplication,
  getBoardService,
} from '../../src/modules/boards/boards.providers';

describe('AuthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const usersRepository = {
      create: jest.fn().mockResolvedValue(mockedUser),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        registerAuthApplication,
        getTokenAuthApplication,
        getTokenAuthService,
        getTeamService,
        getTeamApplication,
        getBoardApplication,
        getBoardService,
        registerAuthService,
        updateUserService,
        createUserService,
        getUserApplication,
        getUserService,
        ConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: getModelToken('Board'),
          useValue: {},
        },
        {
          provide: getModelToken('BoardUser'),
          useValue: {},
        },
        {
          provide: getModelToken('User'),
          useValue: usersRepository,
        },
        {
          provide: getModelToken('Team'),
          useValue: {},
        },
        {
          provide: getModelToken('TeamUser'),
          useValue: {},
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', async () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: mockedUser.email,
            firstName: mockedUser.firstName,
            lastName: mockedUser.lastName,
            password: '1!Aab2CD',
          })
          .expect(201);
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error because full data wasnt submitted', () =>
        request(app.getHttpServer())
          .post('/auth/register')
          .send({ name: '', password: '', email: '' })
          .expect(400));
      it('should throw an error because full data wasnt submitted', async () =>
        request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: mockedUser.firstName,
            lastName: mockedUser.lastName,
          })
          .expect(400));
      it('should throw an error because full data wasnt submitted', async () =>
        request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: mockedUser.firstName,
            lastName: mockedUser.lastName,
            password: mockedUser.password,
          })
          .expect(400));
      it('should throw an error because password is short', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            firstName: mockedUser.firstName,
            lastName: mockedUser.lastName,
            password: '1234',
            email: mockedUser.email,
          });

        expect(res.body.message[0]).toBe(
          'Password too weak. Must have 1 uppercase, 1 lowercase, 1 number and 1 special character',
        );
      });
    });
  });
});