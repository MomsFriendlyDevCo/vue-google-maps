<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

import Debug from '@doop/debug';
const $debug = Debug('vue-google-maps/GTileLayer').enable(true);

/**
 * TileLayer component
 */
export default {
	name: 'GTileLayer',
	mixins: [Options],
	inject: ['map'],
	props: {
		type: { type: String, default: 'basemap', enum: ['basemap', 'layer'] },
		title: { type: String, default: 'TileLayer' }, // TODO: Validate to "mapTypeId" requirements
		url: { type: String },
		show: { type: Boolean, default: true },
		attribution: { type: String },
		options: { type: Object },
	},
	data() { return {
		ready: false,
		visible: true,
	}},
	// NOTE: Has already been destroyed up a level
	/*
	beforeDestroy() {
		// TODO: Any of this correct? Test cases needed. Outside of editing a map we probably never remove these components once added.
		switch (this.type) {
			case 'layer':
				this.mapObject.setMap(null);
				//this.map.mapObject.overlayMapTypes.remove(this.mapObject); // TODO: Remove from list?
				break;
			case 'basemap':
			default:
				this.map.mapObject.mapTypes.set(this.title, null);
				// this.map.mapObject.setMapTypeId(this.title); // TODO: Back to some default?
				break;
		}
	},
	*/
	mounted() {
		this.$watchAll(['title', 'url'], () => {
			$debug('$watchAll.title/url', this.title, this.url, this.options);
			const options = _.merge(
				{},
				{
					// TODO: Get default min/maxZoom from the map instance?
					maxZoom: 24,
					minZoom: 0,
					opacity: 1,
				},
				{
					tileSize: new google.maps.Size(
						(_.has(this.options, 'tileSize')) ? parseInt(this.options.tileSize) : 256,
						(_.has(this.options, 'tileSize')) ? parseInt(this.options.tileSize) : 256,
					),
				},
				_.omit(this.options, ['tileSize']),
			);

			if (this.url) {
				// FIXME: What happens to the last mode instance? It will be re-applied but are we orphaning anything?
				this.mapObject = new google.maps.ImageMapType({
					getTileUrl: (coord, zoom) => {
						if (!this.visible) return;

						//$debug('getTileUrl', coord, zoom, this.url, this.options);
						// "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
						return this.url
							.replace('{r}', '') // TODO: What is this? Tag?
							.replace('{s}', _.has(options, 'subdomains') ? _.sample(options.subdomains) : 'a')
							.replace('{x}', coord.x)
							.replace('{y}', coord.y)
							//.replace('{z}', Math.min(Math.max(zoom, options.maxZoom), options.minZoom)); // FIXME: If attempting to pin to the last available zoom level, x/y will then not be available...
							.replace('{z}', zoom);
					},
					name: this.title,
					...options,
				});
			}

			switch (this.type) {
				case 'layer':
					if (this.mapObject) this.map.mapObject.overlayMapTypes.insertAt(0, this.mapObject);
					break;
				case 'basemap':
				default:
					// NOTE: "mapTypeId" may have been set before this mode existed; Set it again now.
					if (this.mapObject) this.map.mapObject.mapTypes.set(this.title, this.mapObject);
					// FIXME: Force re-fetching of tiles when the existing layer has a cache for this zoom level
					$debug('getMapTypeId', this.map.mapObject.getMapTypeId(), this.title, options);
					if (this.map.mapObject.getMapTypeId() !== this.title) this.map.mapObject.setMapTypeId(this.title);
					if (options) this.map.mapObject.setOptions(options);
					break;
			}

			this.ready = true;
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

