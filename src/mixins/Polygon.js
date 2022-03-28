import Path from './Path';

export default {
	mixins: [Path],
	props: {
		fillColor:  {
			type: String,
			default: "#ff3300"
		},
		fillOpacity:  {
			type: Number,
			default: 1.0
		},
		/*
		smoothFactor: {
			type: Number,
			custom: true,
			default: 1.0
		},
		noClip: {
			type: Boolean,
			custom: true,
			default: false
		}
		*/
	}
};
