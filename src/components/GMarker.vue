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
		icon: {
			type: [Object], // TODO: Object?
			custom: false,
			default: () => ({
				path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
				fillColor: 'blue',
				fillOpacity: 0.8,
				strokeWeight: 0.8,
				rotation: 0,
				scale: 1,
				anchor: new google.maps.Point(15, 30),
			}),
		},
		/*
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
			icon: this.icon,
			map: this.map.mapObject,
			//title: "Hello World!",
		});

		this.mapObject.addListener('click', e => this.$emit('click', e));

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

