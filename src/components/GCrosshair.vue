<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GCrosshairCenter').enable(false);

/**
 * OverlayView crosshair component
 * NOTE: Demonstrates visible lag resulting from draw cycle FPS
 */
export default {
	name: 'GCrosshair',
	mixins: [Options],
	inject: ['map'],
	data() { return {
		ready: false,
	}},
	mounted() {
		class Crosshair extends google.maps.OverlayView {
			containerDiv;

			constructor(content) {
				super();

				const div1 = document.createElement('div');
				div1.style.cssText = 'position: absolute; left: -20px; top: -20px; ' +
					'border-right: 1px solid blue; border-bottom: 1px solid blue; width: 19px; height: 19px';
				const div2 = document.createElement('div');
				div2.style.cssText = 'position: absolute; left: 1px; top: -20px; ' +
					'border-left: 1px solid blue; border-bottom: 1px solid blue; width: 19px; height: 19px';
				const div3 = document.createElement('div');
				div3.style.cssText = 'position: absolute; left: -20px; top: 1px; ' +
					'border-right: 1px solid blue; border-top: 1px solid blue; width: 19px; height: 19px';
				const div4 = document.createElement('div');
				div4.style.cssText = 'position: absolute; left: 1px; top: 1px; ' +
					'border-left: 1px solid blue; border-top: 1px solid blue; width: 19px; height: 19px';

				this.containerDiv = document.createElement('div');
				this.containerDiv.appendChild(div1);
				this.containerDiv.appendChild(div2);
				this.containerDiv.appendChild(div3);
				this.containerDiv.appendChild(div4);
				this.containerDiv.style.cssText = 'position: absolute; display: none';

				// Optionally stop clicks, etc., from bubbling up to the map.
				Crosshair.preventMapHitsAndGesturesFrom(this.containerDiv);
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
				const projection = this.getProjection();
				const divPosition = projection.fromLatLngToDivPixel(this.getMap().getCenter());

				this.containerDiv.style.left = divPosition.x + 'px';
				this.containerDiv.style.top = divPosition.y + 'px';
				this.containerDiv.style.display = 'block';
			}
		};

		this.mapObject = new Crosshair(this.$el);
		this.mapObject.setMap(this.map.mapObject);

		// TODO: Wait for an event?
		this.ready = true;
	},
};
</script>

<template>
	<div class="google-map-crosshair">
		<slot v-if="ready" />
	</div>
</template>
