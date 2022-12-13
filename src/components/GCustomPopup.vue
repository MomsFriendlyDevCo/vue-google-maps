<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GCustomPopup').enable(false);

/**
 * OverlayView dialog component
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
	mounted() {
		class Popup extends google.maps.OverlayView {
			position;
			containerDiv;

			constructor(position, content) {
				super();
				this.position = position;
				content.classList.add("popup-bubble");

				// This zero-height div is positioned at the bottom of the bubble.
				const bubbleAnchor = document.createElement("div");

				bubbleAnchor.classList.add("popup-bubble-anchor");
				bubbleAnchor.appendChild(content);
				// This zero-height div is positioned at the bottom of the tip.
				this.containerDiv = document.createElement("div");
				this.containerDiv.classList.add("popup-container");
				this.containerDiv.appendChild(bubbleAnchor);
				// Optionally stop clicks, etc., from bubbling up to the map.
				Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
			}
			onAdd() {
				this.getPanes().floatPane.appendChild(this.containerDiv);
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
				// Hide the popup when it is far out of view.
				const display =
				Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
					? "block"
					: "none";

				if (display === "block") {
					this.containerDiv.style.left = divPosition.x + "px";
					this.containerDiv.style.top = divPosition.y + "px";
				}

				if (this.containerDiv.style.display !== display) {
					this.containerDiv.style.display = display;
				}
			}
		};

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