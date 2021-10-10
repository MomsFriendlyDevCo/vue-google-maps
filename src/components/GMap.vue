<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

/**
 * Map component
 */
export default {
	name: 'GMap',
	mixins: [Options],
	props: {
		/**
		 * The center of the map, supports .sync modifier
		 */
		center: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},
		/**
		 * The bounds of the map, supports .sync modifier
		 */
		bounds: {
			type: [Array, Object],
			custom: true,
			default: null,
		},
		/**
		 * The max bounds of the map
		 */
		maxBounds: {
			type: [Array, Object],
			default: null,
		},
		/**
		 * The zoom of the map, supports .sync modifier
		 */
		zoom: {
			type: Number,
			custom: true,
			default: 0,
		},
		/**
		 * The minZoom of the map
		 */
		minZoom: {
			type: Number,
			default: null,
		},
		/**
		 * The maxZoom of the map
		 */
		maxZoom: {
			type: Number,
			default: null,
		},
		/**
		 * The paddingBottomRight of the map
		 */
		/*
		paddingBottomRight: {
			type: Array,
			custom: true,
			default: null,
		},
		*/
		/**
		 * The paddingTopLeft of the map
		 */
		/*
		paddingTopLeft: {
			type: Array,
			custom: true,
			default: null,
		},
		*/
		/**
		 * The padding of the map
		 */
		/*
		padding: {
			type: Array,
			custom: true,
			default: null,
		},
		*/
		/**
		 * The worldCopyJump option for the map
		 */
		/*
		worldCopyJump: {
			type: Boolean,
			default: false,
		},
		*/
		/**
		 * The crs option for the map
		 * @values CRS.EPSG3857
		 */
		/*
		// TODO: Google is always the same Web Mercator projection?
		crs: {
			type: Object,
			custom: true,
			default: () => CRS.EPSG3857,
		},
		*/
		/*
		maxBoundsViscosity: {
			type: Number,
			default: null,
		},
		inertia: {
			type: Boolean,
			default: null,
		},
		inertiaDeceleration: {
			type: Number,
			default: null,
		},
		inertiaMaxSpeed: {
			type: Number,
			default: null,
		},
		easeLinearity: {
			type: Number,
			default: null,
		},
		zoomAnimation: {
			type: Boolean,
			default: null,
		},
		zoomAnimationThreshold: {
			type: Number,
			default: null,
		},
		fadeAnimation: {
			type: Boolean,
			default: null,
		},
		markerZoomAnimation: {
			type: Boolean,
			default: null,
		},
		noBlockingAnimations: {
			type: Boolean,
			default: false,
		},
		*/

		// TODO: mapTypeId
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
		console.log('props', this.$props);
		const options = {
			mapTypeId: 'hybrid',
			//noClear: true,
			center: {
				lat: this.center[0],
				lng: this.center[1]
			},
			zoom: this.zoom,
			// TODO: minZoom, maxZoom
		};

		if (this.maxBounds && this.maxBounds.length === 2 && this.maxBounds[0] && this.maxBounds[0].length === 2 && this.maxBounds[1] && this.maxBounds[1].length === 2)
			options.restriction = {
				latLngBounds: {
					north: this.maxBounds[0][0],
					south: this.maxBounds[1][0],
					west: this.maxBounds[1][1],
					east: this.maxBounds[0][1],
				},
				strictBounds: true,
			};

		console.log('options', options);
		this.mapObject = new google.maps.Map(this.$el, options);
		this.ready = true;
	},
};
</script>

<template>
	<div class="google-map">
		<slot v-if="ready" />
	</div>
</template>


<style type="text/css">
.google-map {
	position: fixed !important; 
	height: 100% !important;
	width: 100% !important;
}
</style>
