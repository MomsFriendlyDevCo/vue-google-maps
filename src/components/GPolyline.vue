<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Polyline from '../mixins/Polyline.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

/**
 * Marker component
 */
export default {
	name: 'GPolyline',
	mixins: [Polyline, Options],
	inject: ['map'],
	props: {
		latLngs: {
			type: Array,
			default: () => [],
		},
	},
	data() { return {
		ready: false,
	}},
	beforeDestroy() {
		this.mapObject.setMap(null);
	},
	mounted() {
		this.mapObject = new google.maps.Polyline({
			...this.pathOptions,
			clickable: true,
			draggable: false,
			editable: false,
			geodesic: false,
			icons: [],
			map: this.map.mapObject,
			path: this.latLngs.map(p => ({ lat: p[0], lng: p[1] })),
			visible: true,
			zIndex: 0,
		});

		this.$debug('mapObject', this.mapObject)

		//this.mapObject.addListener('click', (e) => this.$emit('click', e));

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
