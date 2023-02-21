<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GInfoWindow').enable(false);

/**
 * InfoWindow dialog component
 */
export default {
	name: 'GInfoWindow',
	mixins: [Options],
	inject: ['map'],
	props: {
	},
	data() { return {
		ready: false,
	}},
	props: {
		openOn: {
			type: String,
			default: 'mouseover',
		},
		closeOn: {
			type: String,
			default: 'mouseout',
		},
	},
	mounted() {
		this.mapObject = new google.maps.InfoWindow({
			content: this.$slots.default[0]?.elm?.outerHTML,
		});

		this.mapObject.setMap(this.map.mapObject);

		this.$parent.mapObject.addListener(this.openOn, () => {
			this.mapObject.open({
				anchor: this.$parent.mapObject,
				//map: this.map.mapObject,
			});
		});

		this.$parent.mapObject.addListener(this.closeOn, () => {
			this.mapObject.close();
		});
	},
};
</script>

<template>
	<div class="google-map-info-window">
		<slot/>
	</div>
</template>
