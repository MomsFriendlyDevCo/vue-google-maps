<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Poly from '../mixins/Poly.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GPolyline').enable(false);

/**
 * Polyline component
 */
export default {
	name: 'GPolyline',
	mixins: [Poly, Options],
	inject: ['map'],
	data() { return {
		ready: false,
	}},
	props: {
		clickable: {
			type: Boolean,
			default: true,
		},
		draggable: {
			type: Boolean,
			default: false,
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
	},
	beforeDestroy() {
		this.mapObject.setMap(null);
	},
	mounted() {
		this.mapObject = new google.maps.Polyline({
			...this.pathOptions,
			clickable: this.clickable,
			draggable: this.draggable,
			editable: this.editable,
			geodesic: false,
			icons: [],
			map: this.map.mapObject,
			path: this.latLngs.map(p => ({ lat: p[0], lng: p[1] })),
			visible: this.visible,
			zIndex: this.zIndex,
		});

		this.$watch('clickable', () => this.mapObject.setClickable(this.clickable)); // Method does not exist in Poly?
		this.$watch('draggable', () => this.mapObject.setDraggable(this.draggable));
		this.$watch('editable', () => this.mapObject.setEditable(this.editable));
		this.$watch('visible', () => this.mapObject.setVisible(this.visible));
		//this.$watch('zIndex', () => this.mapObject.setZIndex(this.zIndex)); // Method does not exist in Poly

		this.ready = true;
	},
	render: function(h) {
		if (this.ready && this.$slots.default) {
			return h('div', { style: { display: 'none' } }, this.$slots.default);
		}
		return null;
	},
};
</script>
