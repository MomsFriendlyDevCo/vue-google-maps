<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Utils from '../mixins/Utils.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

import Debug from '@doop/debug';
const $debug = Debug('vue-google-maps/GGeojsonLayer').enable(true);

/**
 * GeoJsonLayer component
 */
export default {
	name: 'GGeojsonLayer',
	mixins: [Utils, Options],
	inject: ['map'],
	props: {
		title: { type: String, default: 'GeoJSONLayer' }, // TODO: Validate to "mapTypeId" requirements
		url: { type: String, required: true },
		show: { type: Boolean, default: true },
		attribution: { type: String },
		options: { type: Object },
		styles: { type: Object },
	},
	data() { return {
		ready: false,
		visible: true,
		listeners: {},
		featuresById: {},
	}},
	methods: {
		getTileUrl(x, y, z) {
			$debug('getTileUrl', x, y, z);
			// "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
			return this.url
				.replace('{r}', '') // TODO: What is this? Tag?
				.replace('{s}', _.has(this.options, 'subdomains') ? _.sample(this.options.subdomains) : 'a')
				.replace('{x}', x)
				.replace('{y}', y)
				.replace('{z}', z);
		},

		convertZoomtoTile(zoom) {
			return Math.floor(zoom);
		},

		// @see https://gis.stackexchange.com/a/133535/37614
		// @see https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_(JavaScript/ActionScript,_etc.)
		convertLatToTile(lat, zoom) {
			return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
		},
		convertLngToTile(lng, zoom) {
			return (Math.floor((lng+180)/360*Math.pow(2,zoom)));
		},
		/*
		convertTileToLat(y, zoom) {
			$debug('convertTileToLat', y, zoom);
			const z = Math.floor(zoom);
			const n = Math.PI-2*Math.PI*y/Math.pow(2,z);
			const rads = (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
			return rads * (180/Math.PI); // Radians to Degrees // FIXME: Needed?
		},
		convertTileToLng(x, zoom) {
			$debug('convertTileToLng', x, zoom);
			const z = Math.floor(zoom);
			return (x/Math.pow(2,z)*360-180);
		},
		*/
		update() {
			if (!this.url) return;

			const mapObject = this.map.mapObject;
			const center = this.map.mapObject.getCenter();
			$debug('center', center);
			if (!center) return;

			const coords = [this.map.mapObject.getCenter().lat(), this.map.mapObject.getCenter().lng()];
			$debug('coords', coords);
			const zoom = this.map.mapObject.getZoom();
			$debug('zoom', zoom);

			// Fetch neighbouring tiles
			const directions = [
				[0,0],
				[-1,-1],
				[-1,0],
				[-1,1],
				[0,-1],
				[0,0],
				[0,1],
				[1,-1],
				[1,0],
				[1,1],
			];

			return Promise.all(directions.map(direction => {
				const url = this.getTileUrl(
					this.convertLngToTile(coords[1], zoom) + direction[1],
					this.convertLatToTile(coords[0], zoom) + direction[0],
					this.convertZoomtoTile(zoom),
				);
				$debug('url', url);

				// TODO: Axios? $http?
				// TODO: Cancel pending
				return fetch(url)
					.then(res => res.json())
					.then(features => {
						return features.map(feature => {
							switch (feature.geometry.type) {
								case 'MultiPolygon':
								case 'Polygon':
									const polygonPaths = new google.maps.MVCArray(
										feature.geometry.coordinates
											.map(ring => new google.maps.MVCArray(ring.map(point => new google.maps.LatLng(this.convertLatLng([point[1],point[0]])))))
									);
									if (_.has(this.featuresById, feature.properties.id)) { // Update existing feature
										this.featuresById[feature.properties.id].setPaths(polygonPaths);
									} else { // Create new feature
										return this.featuresById[feature.properties.id] = new google.maps.Polygon({
											...this.styles.polygon,
											geodesic: false,
											icons: [],
											map: this.map.mapObject,
											paths: polygonPaths,
											visible: this.visible,
											//zIndex: 1,
										});
									}
								case 'Point':
								case 'Polyline':
								default:
									console.warn(`Feature type "${feature.geometry.type}" not yet implemented!`);
									break;
							}
						});
					});
			}))
			.finally(() => {
				this.ready = true;
			});
		},
	},
	beforeDestroy() {
		google.maps.event.removeListener(this.listeners.handleCenter);
		google.maps.event.removeListener(this.listeners.handleZoom);
		google.maps.event.removeListener(this.listeners.handleIdle);
	},
	mounted() {
		this.listeners.handleCenter = this.map.mapObject.addListener('center_changed', () => {
			this.update();
		});

		this.listeners.handleZoom = this.map.mapObject.addListener('zoom_changed', () => {
			this.update();
		});

		this.$watchAll(['title', 'url'], () => {
			$debug('$watchAll.title/url', this.title, this.url, this.options);
			this.listeners.handleIdle = this.map.mapObject.addListener('idle', () => {
				google.maps.event.removeListener(this.listeners.handleIdle); // Once
				this.update();
			});
			this.update();
		}, { immediate: true });

		// TODO: remove and re-add or some way to hide?
		this.$watch('show', () => {
			this.$debug('$watch.show', this.show, this.visible);
			this.visible = this.show;
		}, { immediate: true });
	},
	render: function(h) {
		if (this.ready && this.$slots.default) {
			return h('div', { style: { display: 'none' } }, this.$slots.default);
		}
		return null;
	},
};
</script>

