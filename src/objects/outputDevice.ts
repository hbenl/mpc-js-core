export class OutputDevice {

	id: number;
	name: string;
	enabled: boolean;

	constructor(valueMap: Map<string, string>) {

		if (!valueMap.has('outputid')) throw new Error('ID not found for OutputDevice object');
		if (!valueMap.has('outputname')) throw new Error('Name not found for OutputDevice object');
		if (!valueMap.has('outputenabled')) throw new Error('Enabled flag not found for OutputDevice object');

		this.id = Number(valueMap.get('outputid')!);
		this.name = valueMap.get('outputname')!;
		this.enabled = Boolean(Number(valueMap.get('outputenabled')!));
	}
}
