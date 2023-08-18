<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Utils from '../mixins/Utils.js';
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
	mixins: [Utils, Poly, Options],
	inject: ['map'],
	data() { return {
		ready: false,
	}},
	props: {
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
	computed: {
		path() {
			return this.latLngs.map(p => new google.maps.LatLng(this.convertLatLng(p)));
		},
	},
	methods: {
		update() {
			const evt = this.mapObject.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
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
			editable: this.editable,
			geodesic: false,
			icons: [],
			map: this.map.mapObject,
			path: new google.maps.MVCArray(this.path),
			visible: this.visible,
			zIndex: this.zIndex,
		});

		this.$watch('clickable', () => this.mapObject.setClickable(this.clickable)); // Method does not exist in Poly?
		this.$watch('draggable', () => this.mapObject.setDraggable(this.draggable));
		this.$watch('editable', () => this.mapObject.setEditable(this.editable));
		this.$watch('visible', () => this.mapObject.setVisible(this.visible));
		//this.$watch('zIndex', () => this.mapObject.setZIndex(this.zIndex)); // Method does not exist in Poly
		this.$watch('latLngs', () => this.mapObject.setPath(new google.maps.MVCArray(this.path)), { deep: true });

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
