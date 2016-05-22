export class OutputDevice {

	id: number;
	name: string;
	enabled: boolean;

	constructor(valueMap: Map<string, string>) {
		this.id = Number(valueMap.get('outputid'));
		this.name = valueMap.get('outputname');
		this.enabled = Boolean(Number(valueMap.get('outputenabled')));
	}
}
