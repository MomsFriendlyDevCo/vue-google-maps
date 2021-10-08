<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

/**
 * Map component
 */
export default app.component('GMap', {
	name: 'GMap',
	mixins: [Options],
	props: {
	
	},
	data() { return {
		ready: false,
	}},
	methods: {
		
	},
	beforeDestroy() {
		//if (this.debouncedMoveEndHandler) {
		//  this.debouncedMoveEndHandler.cancel();
		//}

		//if (this.mapObject) {
		//	this.mapObject.remove();
		//}
	},
	mounted() {
		const options = {};
		console.log('google', google);
		//this.mapObject = new google.maps.Map(this.$el, options);
		
	},
});
</script>

<template>
  <div class="google-map">
	<slot v-if="ready" />
  </div>
</template>


<style type="text/css">
.google-map {
  height: 100%;
  width: 100%;
}
</style>
