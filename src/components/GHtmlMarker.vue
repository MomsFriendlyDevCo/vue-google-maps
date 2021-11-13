<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

/**
 * Marker component
 */
export default {
	name: 'GHtmlMarker',
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
	mounted() {
		class HtmlMarker extends google.maps.OverlayView {
			position;
			containerDiv;

			constructor(position, content) {
				super();
				this.position = position;

				this.containerDiv = document.createElement('div');
				this.containerDiv.appendChild(content);
				this.containerDiv.classList.add('g-html-marker-container');

				// Optionally stop clicks, etc., from bubbling up to the map.
				//HtmlMarker.preventMapHitsAndGesturesFrom(this.containerDiv);
			}
			onAdd() {
				// TODO: Use `overlayImage` or `floatPane` or `markerLayer` pane?
				this.getPanes().markerLayer.appendChild(this.containerDiv);
			}
			onRemove() {
				if (this.containerDiv.parentElement) {
					this.containerDiv.parentElement.removeChild(this.containerDiv);
				}
			}
			draw() {
				const divPosition = this.getProjection().fromLatLngToDivPixel(
					this.position
				);

				this.containerDiv.style.left = divPosition.x + "px";
				this.containerDiv.style.top = divPosition.y + "px";
			}
		};

		this.mapObject = new HtmlMarker(
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
	<div class="google-map-html-marker">
		<slot v-if="ready" />
	</div>
</template>

<style>
.g-html-marker-container {
	position: absolute;
}
</style>