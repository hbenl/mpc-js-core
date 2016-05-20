import { MPDProtocol } from './protocol';
import { StatusCommands, PlaybackCommands, PlaybackOptionsCommands, CurrentPlaylistCommands } from './commands/index';

export class MPC extends MPDProtocol {

	status: StatusCommands;
	playback: PlaybackCommands;
	playbackOptions: PlaybackOptionsCommands;
	currentPlaylist: CurrentPlaylistCommands;
	
	constructor() {
		super();
		this.status = new StatusCommands(this);
		this.playback = new PlaybackCommands(this);
		this.playbackOptions = new PlaybackOptionsCommands(this);
		this.currentPlaylist = new CurrentPlaylistCommands(this);
	}
}
