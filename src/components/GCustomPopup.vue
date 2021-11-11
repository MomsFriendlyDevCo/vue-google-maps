<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';
import Popup from '../libs/popup.js';

/**
 * Marker component
 */
export default {
	name: 'GCustomPopup',
	mixins: [Options],
	inject: ['map'],
	props: {
		position: {
			type: [Object, Array],
			custom: true,
			default: null,
		},
	},
	data() { return {
		ready: false,
	}},
	methods: {
		
	},
	beforeDestroy() {
	},
	mounted() {
		console.log('GCustomPopup', this.$el, this.position, this.$slots.default)
		// FIXME: May happen before `google` is available?
		this.mapObject = new Popup(
			// FIXME: Accept array or object...
			//_.isObject(this.position) ? this.position : google.maps.LatLng(...this.position),
			new google.maps.LatLng(...this.position),
			this.$el
		);
		this.mapObject.setMap(this.map.mapObject);

		// TODO: Wait for an event?
		this.ready = true;
	},
};
</script>

<template>
	<div class="google-map-custom-popup">
		<slot v-if="ready" />
	</div>
</template>

<style>
.popup-container {
	position: absolute;
}
</style>