export class Mount {

	path: string;
	storage: string;

	constructor(valueMap: Map<string, string>) {
		this.path = valueMap.get('mount');
		this.storage = valueMap.get('storage');
	}
}

export class Neighbor {

	neighbor: string;
	name: string;

	constructor(valueMap: Map<string, string>) {
		this.neighbor = valueMap.get('neighbor');
		this.name = valueMap.get('name');
	}
}
