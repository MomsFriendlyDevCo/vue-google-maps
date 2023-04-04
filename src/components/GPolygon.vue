<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Poly from '../mixins/Poly.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GPolygon').enable(false);

/**
 * Polygon component
 */
export default {
	name: 'GPolygon',
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
		fill: {
			type: Boolean,
			default: true,
		},
		fillColor: {
			type: String,
			default: '#3388ff'
		},
		fillOpacity: {
			type: Number,
			default: 0.2
		},
		fillRule: {
			type: String,
			default: 'evenodd'
		},
	},
	beforeDestroy() {
		this.mapObject.setMap(null);
	},
	mounted() {
		this.mapObject = new google.maps.Polygon({
			...this.pathOptions,
			clickable: this.clickable,
			draggable: this.draggable,
			fillColor: this.fillColor,
			fillOpacity: this.fillOpacity,
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
