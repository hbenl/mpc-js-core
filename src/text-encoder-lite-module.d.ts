declare module TextEncoderLite {
	class TextEncoderLite {
		constructor();
		encode(str: string): Uint8Array;
	}
	class TextDecoderLite {
		constructor();
		decode(arr: Uint8Array): string;
	}
}
declare module 'text-encoder-lite-module' {
	export = TextEncoderLite;
}
