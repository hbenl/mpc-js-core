import { MPDProtocol } from './protocol';
import { StatusCommands, PlaybackCommands, PlaybackOptionsCommands, CurrentPlaylistCommands, StoredPlaylistsCommands } from './commands/index';

export class MPC extends MPDProtocol {

	status: StatusCommands;
	playback: PlaybackCommands;
	playbackOptions: PlaybackOptionsCommands;
	currentPlaylist: CurrentPlaylistCommands;
	storedPlaylists: StoredPlaylistsCommands;
	
	constructor() {
		super();
		this.status = new StatusCommands(this);
		this.playback = new PlaybackCommands(this);
		this.playbackOptions = new PlaybackOptionsCommands(this);
		this.currentPlaylist = new CurrentPlaylistCommands(this);
		this.storedPlaylists = new StoredPlaylistsCommands(this);
	}
}
