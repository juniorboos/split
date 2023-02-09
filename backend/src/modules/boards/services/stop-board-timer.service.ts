import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOARD_TIMER_SERVER_STOPPED } from 'src/libs/constants/timer';
import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import ServerStoppedTimerEvent from 'src/modules/boards/events/server-stopped-timer.event';
import StopBoardTimerService from 'src/modules/boards/interfaces/services/stop-board-timer.service.interface';
import { TYPES } from 'src/modules/boards/interfaces/types';
import BoardTimerRepository from 'src/modules/boards/repositories/board-timer.repository';

@Injectable()
export default class StopBoardTimerServiceImpl implements StopBoardTimerService {
	private logger: Logger = new Logger(StopBoardTimerServiceImpl.name);

	constructor(
		@Inject(TYPES.repositories.BoardTimerRepository)
		private boardTimerRepository: BoardTimerRepository,

		private eventEmitter: EventEmitter2
	) {}

	stopTimer(boardTimerDto: BoardTimerDto) {
		this.logger.log(`Will stop timer. Board: "${boardTimerDto.boardId})"`);

		const boardTimer = this.boardTimerRepository.findBoardTimerByBoardId(boardTimerDto.boardId);

		boardTimer.timerHelper.stop();

		this.eventEmitter.emit(
			BOARD_TIMER_SERVER_STOPPED,
			new ServerStoppedTimerEvent({ ...boardTimerDto, ...boardTimer.timerHelper.state })
		);
	}
}