<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

import Debug from '@doop/debug';
const $debug = Debug('vue-google-maps/GTileLayer').enable(false);

/**
 * TileLayer component
 */
export default {
	name: 'GTileLayer',
	mixins: [Options],
	inject: ['map'],
	props: {
		title: { type: String, default: 'TileLayer' }, // TODO: Validate to "mapTypeId" requirements
		url: { type: String },
		attribution: { type: String },
		options: { type: Object },
	},
	data() { return {
		ready: false,
	}},
	// NOTE: Has already been destroyed up a level
	//beforeDestroy() {
	//	this.map.mapObject.mapTypes.set('TileLayer', null);
	//},
	mounted() {
		this.$watch('url', () => {
			$debug('$watch.url', this.url);

			// FIXME: What happens to the last mode instance? It will be re-applied but are we orphaning anything?
			this.mapObject = new google.maps.ImageMapType({
				getTileUrl: (coord, zoom) => {
					$debug('getTileUrl', coord, zoom, this.url, this.options);
					// "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
					return this.url
						.replace('{r}', '') // TODO: What is this? Tag?
						.replace('{s}', _.has(this.options, 'subdomains') ? _.sample(this.options.subdomains) : 'a')
						.replace('{x}', coord.x)
						.replace('{y}', coord.y)
						.replace('{z}', zoom);
				},
				// TODO: Separate X/Y?
				tileSize: new google.maps.Size(
					(_.has(this.options, 'tileSize')) ? parseInt(this.options.tileSize) : 256,
					(_.has(this.options, 'tileSize')) ? parseInt(this.options.tileSize) : 256,
				),
				maxZoom: (_.has(this.options, 'maxZoom')) ? parseInt(this.options.maxZoom) : 20,
				minZoom: (_.has(this.options, 'minZoom')) ? parseInt(this.options.minZoom) : 0,
				// @ts-ignore TODO 'radius' does not exist in type 'ImageMapTypeOptions'
				//radius: 1738000,
				name: this.title,
			});

			this.map.mapObject.mapTypes.set(this.title, this.mapObject);
			// NOTE: "mapTypeId" may have been set before this mode existed; Set it again now.
			if (this.map.mapObject.getMapTypeId() !== this.title) this.map.mapObject.setMapTypeId(this.title);

			this.ready = true;
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

