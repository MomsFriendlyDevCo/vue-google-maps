<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
import GoogleMaps from '../mixins/GoogleMaps.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GMapVector').enable(false);

/**
 * Map component
 */
export default {
	name: 'GMapVector',
	mixins: [GoogleMaps, Options],
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
		/**
		 * The tilt of the camera
		 */
		tilt: {
			type: Number,
			custom: true,
			default: 0,
		},
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

		// TODO: mapTypeId

		mapTypeId: {
			type: String,
			default: 'roadmap',
		},
		mapId: {
			type: String,
			default: '15431d2b469f209e', // This is a pre-defined vector map with tilt/heading enabled.
		},
	},
	data() { return {
		ready: false,
	}},
	methods: {
		initGoogleMaps() {
			// TODO: "$props.options" should extend/overload these defaults until a provided property overrules it.
			const options = _.defaults(_.omit(this.$props, ['center', 'maxBounds']),
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

			// FIXME: These event names are no good if they aren't always at the "end"
			this.mapObject.addListener('center_changed', e => this.$emit('moveend', [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()]));
			this.mapObject.addListener('heading_changed', e => this.$emit('headingend', this.mapObject.getHeading()));
			this.mapObject.addListener('tilt_changed', e => this.$emit('tiltend', this.mapObject.getTilt()));
			this.mapObject.addListener('zoom_changed', e => this.$emit('zoomend', this.mapObject.getZoom()));

			// Track middle-mouse for heading/tilt {{{
			// FIXME: Fails until first pan or zoom? Does it?
			const clicked = {
				x: null,
				y: null,
			};
			this.$el.addEventListener('mousemove', e => {
				if (clicked.x === null || clicked.y === null) return;

				const diff = {
					x: clicked.x - e.pageX,
					y: clicked.y - e.pageY,
				};
				clicked.x = e.pageX;
				clicked.y = e.pageY;

				this.mapObject.moveCamera({
					heading: this.mapObject.getHeading() - diff.x,
					tilt: this.mapObject.getTilt() + diff.y,
					zoom: this.mapObject.getZoom(),
				});
			});

			this.$el.addEventListener('pointerup', e => {
				if (e.button !== 1) return;

				clicked.x = null;
				clicked.y = null;
			});

			this.$el.addEventListener('pointerdown', e => {
				if (e.button !== 1) return;

				clicked.x = e.pageX;
				clicked.y = e.pageY;
			});
			// }}}

			this.initWatchers();

			this.$watch('tilt', () => {
				if (this.tilt !== this.mapObject.getTilt())
					this.mapObject.setTilt(this.tilt);
			}, { immediate: true });

			// TODO: Update zoom and center on pan/zoom, but they're properties... Need to fire an event

			this.ready = true;
			this.$emit('loaded');
		},
	}
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
