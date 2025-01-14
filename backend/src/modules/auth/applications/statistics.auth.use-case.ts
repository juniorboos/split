import { Inject, Injectable } from '@nestjs/common';
import * as User from 'src/modules/users/interfaces/types';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import * as Boards from 'src/modules/boards/interfaces/types';
import { GetBoardApplicationInterface } from 'src/modules/boards/interfaces/applications/get.board.application.interface';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { StatisticsAuthUserUseCaseInterface } from '../interfaces/applications/statistics.auth.use-case.interface';
import { GetTeamUserServiceInterface } from 'src/modules/teamUsers/interfaces/services/get.team.user.service.interface';

@Injectable()
export default class StatisticsAuthUserUseCase implements StatisticsAuthUserUseCaseInterface {
	constructor(
		@Inject(User.TYPES.services.GetUserService)
		private getUserService: GetUserServiceInterface,
		@Inject(TeamUsers.TYPES.services.GetTeamUserService)
		private getTeamUserService: GetTeamUserServiceInterface,
		@Inject(Boards.TYPES.applications.GetBoardApplication)
		private getBoardService: GetBoardApplicationInterface
	) {}

	public async execute(userId: string) {
		const [usersCount, teamsCount, boardsCount] = await Promise.all([
			this.getUserService.countUsers(),
			this.getTeamUserService.countTeamsOfUser(userId),
			this.getBoardService.countBoards(userId)
		]);

		return { usersCount, teamsCount, boardsCount };
	}
}
