import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';

import JwtAuthenticationGuard from 'libs/guards/jwtAuth.guard';
import { BadRequestResponse } from 'libs/swagger/errors/bad-request.swagger';
import { InternalServerErrorResponse } from 'libs/swagger/errors/internal-server-error.swagger';
import { UnauthorizedResponse } from 'libs/swagger/errors/unauthorized.swagger';

import UserDto from '../dto/user.dto';
import { GetUserApplication } from '../interfaces/applications/get.user.application.interface';
import { TYPES } from '../interfaces/types';

@ApiBearerAuth('access-token')
@ApiTags('Users')
@UseGuards(JwtAuthenticationGuard)
@Controller('users')
export default class UsersController {
	constructor(
		@Inject(TYPES.applications.GetUserApplication)
		private getUserApp: GetUserApplication
	) {}

	@ApiOperation({ summary: 'Retrieve a list of existing users' })
	@ApiOkResponse({ description: 'Users successfully retrieved!', type: UserDto, isArray: true })
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
		type: UnauthorizedResponse
	})
	@ApiBadRequestResponse({
		description: 'Bad Request',
		type: BadRequestResponse
	})
	@ApiInternalServerErrorResponse({
		description: 'Internal Server Error',
		type: InternalServerErrorResponse
	})
	@Get()
	getAllUsers() {
		return this.getUserApp.getAllUsers();
	}
}