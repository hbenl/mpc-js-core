import { MPDProtocol } from './protocol';
import { StatusCommands } from './commands/index';

export class MPC extends MPDProtocol {

	status: StatusCommands;

	constructor() {
		super();
		this.status = new StatusCommands(this);
	}
}
