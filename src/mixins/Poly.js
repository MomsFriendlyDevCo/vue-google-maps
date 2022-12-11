import Path from './Path';

export default {
	mixins: [Path],
	props: {
		latLngs: {
			type: Array,
			default: () => [],
		},
		clickable: {
			type: Boolean,
			default: true,
		},
		draggable: {
			type: Boolean,
			default: false,
		},
		editable: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			default: true,
		},
		zIndex: {
			type: Number,
			default: 0,
		},
	}
};
