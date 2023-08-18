<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Poly from '../mixins/Poly.js';
import Utils from '../mixins/Utils.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GPolygon').enable(false);

/**
 * Polygon component
 */
export default {
	name: 'GPolygon',
	mixins: [Poly, Utils, Options],
	inject: ['map'],
	data() { return {
		ready: false,
	}},
	props: {
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
	computed: {
		path() {
			return this.latLngs.map(ring => new google.maps.MVCArray(ring.map(point => new google.maps.LatLng(this.convertLatLng(point)))));
		},
	},
	methods: {
		update() {
			const evt = this.mapObject.getPaths().getArray().map(ring => ring.getArray().map(p => ({ lat: p.lat(), lng: p.lng() })));
			this.$emit('update:latLngs', evt);
			this.$emit('update:lat-lngs', evt);
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
			paths: new google.maps.MVCArray(this.path),
			visible: this.visible,
			zIndex: this.zIndex,
		});

		this.$watch('clickable', () => this.mapObject.setClickable(this.clickable)); // Method does not exist in Poly?
		this.$watch('draggable', () => this.mapObject.setDraggable(this.draggable));
		this.$watch('editable', () => this.mapObject.setEditable(this.editable));
		this.$watch('visible', () => this.mapObject.setVisible(this.visible));
		//this.$watch('zIndex', () => this.mapObject.setZIndex(this.zIndex)); // Method does not exist in Poly
		this.$watch('latLngs', () => this.mapObject.setPaths(new google.maps.MVCArray(this.path)), { deep: true });

		if (this.editable && this.path.length === 0) this.startCreate();

		this.mapObject.addListener('dragend', e => {
			if (!this.draggable) return;

			this.update();
		});

		this.mapObject.addListener('mouseover', e => this.$emit('mouseover', e));
		this.mapObject.addListener('mouseout', e => this.$emit('mouseout', e));
		this.mapObject.addListener('click', e => {
			if (!this.clickable) return;

			this.$emit('click', e);
		});

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
