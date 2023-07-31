<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import Utils from '../mixins/Utils.js';
import GoogleMaps from '../mixins/GoogleMaps.js';
import Options from '../mixins/Options.js';
import SmoothMotion from '../mixins/SmoothMotion.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GMapRaster').enable(false);

/**
 * Map component
 */
export default {
	name: 'GMapRaster',
	mixins: [Utils, GoogleMaps, Options, SmoothMotion],
	provide() { return {
		map: this,
	}},
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
		 * The heading or rotation of the map, supports .sync modifier
		 */
		heading: {
			type: Number,
			custom: true,
			default: 0,
		},
		// TODO: Tilt is supported but only 0/45 and only satellite or hybrid raster maps
		/**
		 * The zoom of the map, supports .sync modifier
		 */
		zoom: {
			type: Number,
			custom: true,
			default: 16,
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

		mapTypeId: {
			type: String,
		},

		options: {
			type: Object,
			default: null,
		},
	},
	data() { return {
		ready: false,
	}},
	methods: {
		initGoogleMaps() {
			this.$debug('initGoogleMaps', this.$props.options);

			const options = {};

			_.defaults(
				options,
				_.omit(this.$props, ['center', 'maxBounds', 'options']),
				this.$props.options,
				{
					//mapTypeId: 'hybrid',
					//noClear: true,
					//tilt: 0,
					//heading: 0,
					//zoom: 16,
					// TODO: minZoom, maxZoom
					disableDefaultUI: true,
					//gestureHandling: 'none',
					keyboardShortcuts: false,
					rotateControl: true,
					scrollwheel: true,
					streetViewControl: false,
					zoomControl: false,
				}
			);

			if (!options.mapTypeId) options.mapTypeId = 'hybrid'; // Setting a default here so "$props.options" and "$props" simply default

			// FIXME: Only apply via watcher? These options may overrule later changes?
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

			console.log('Creating Google Maps Instance', this.$el, options);
			this.mapObject = new google.maps.Map(this.$el, options);
			//if (_.isFunction(this.mapObject.getMapCapabilities)) console.log('Map Capabilities', this.mapObject.getMapCapabilities());

			this.mapObject.addListener('click', e => this.$emit('click', [e.latLng.lat(), e.latLng.lng()]));

			this.mapObject.addListener('heading_changed', e => {
				if (this.pendingSmooth) return;

				this.$emit('headingend', this.mapObject.getHeading());
			});

			this.mapObject.addListener('center_changed', e => {
				if (this.pendingSmooth) return;

				this.$emit('moveend', [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()]);
			});

			this.mapObject.addListener('zoom_changed', e => {
				if (this.pendingSmooth) return;

				this.$emit('zoomend', this.mapObject.getZoom());
			});

			this.mapObject.addListener('mousemove', e => this.$emit('mousemove', [e.latLng.lat(), e.latLng.lng()]));

			this.initWatchers();

			// TODO: Implement tilt 0/45 switching

			this.ready = true;
			this.$emit('loaded');
		},
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
