<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

/**
 * Marker component
 */
export default {
	name: 'GMarker',
	mixins: [Options],
	inject: ['map'],
	props: {
		/*
		pane: {
			type: String,
			default: 'markerPane',
		},
		*/
		/*
		// TODO:
		draggable: {
			type: Boolean,
			custom: true,
			default: false,
		},
		*/
		position: {
			type: [Object, Array],
			custom: true,
			default: null,
		},
		/*
		// TODO:
		icon: {
			type: [Object],
			custom: false,
			//default: () => new Icon.Default(),
		},
		opacity: {
			type: Number,
			custom: false,
			default: 1.0,
		},
		*/
		/*
		zIndexOffset: {
			type: Number,
			custom: false,
			default: null,
		},
		*/
	},
	data() { return {
		ready: false,
	}},
	methods: {
		
	},
	beforeDestroy() {
	},
	mounted() {
		this.mapObject = new google.maps.Marker({
			// TODO: Handle array or object
			position: { lat: this.position[0], lng: this.position[1] },
			map: this.map.mapObject,
			title: "Hello World!",
		});
		console.log('map', this.map, this.mapObject);

		// TODO: Wait for an event?
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

