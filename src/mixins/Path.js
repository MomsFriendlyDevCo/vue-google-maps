//import Layer from './Layer';
//import InteractiveLayer from './InteractiveLayer';

export default {
	//mixins: [Layer, InteractiveLayer],
	props: {
		stroke: {
			type: Boolean,
			custom: true,
			default: true
		},
		color: {
			type: String,
			custom: true,
			default: '#3388ff'
		},
		weight: {
			type: Number,
			custom: true,
			default: 3
		},
		opacity: {
			type: Number,
			custom: true,
			default: 1.0
		},
		/*
		lineCap: {
			type: String,
			custom: true,
			default: 'round'
		},
		lineJoin: {
			type: String,
			custom: true,
			default: 'round'
		},
		dashArray: {
			type: String,
			custom: true,
			default: null
		},
		dashOffset: {
			type: String,
			custom: true,
			default: null
		},
		className: {
			type: String,
			custom: true,
			default: null
		}
		*/
	},
	mounted() {
		this.pathOptions = {
			strokeColor: (this.stroke) ? this.color : undefined,
			strokeOpacity: (this.stroke) ? this.opacity : undefined,
			strokeWeight: (this.stroke) ? this.weight : undefined,
		};
	}
};
