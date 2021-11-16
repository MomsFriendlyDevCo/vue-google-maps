<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

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
	mounted() {
		// TODO: The rest... Attach to a marker's events
		this.mapObject = new google.maps.InfoWindow({
			content: '' // TODO: slot default content
		});

		this.mapObject.setMap(this.map.mapObject);

		// TODO: Wait for an event?
		this.ready = true;
	},
};
</script>

<template>
	<div class="google-map-info-window">
		<slot v-if="ready" />
	</div>
</template>
