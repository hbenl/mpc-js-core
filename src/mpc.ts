import { MPDProtocol } from './protocol';
import { StatusCommands, PlaybackOptionsCommands } from './commands/index';

export class MPC extends MPDProtocol {

	status: StatusCommands;
	playbackOptions: PlaybackOptionsCommands;
	
	constructor() {
		super();
		this.status = new StatusCommands(this);
		this.playbackOptions = new PlaybackOptionsCommands(this);
	}
}
