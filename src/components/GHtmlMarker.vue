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
		clickable: {
			type: Boolean,
			default: true,
		},
		draggable: {
			type: Boolean,
			default: false,
		},
		pane: {
			type: String,
			default: 'overlayImage', // 'markerLayer' <- Is below other interactive layers,
		},
	},
	data() { return {
		ready: false,
	}},
	mounted() {
		class HtmlMarker extends google.maps.OverlayView {
			position;
			draggable;
			pane;
			content;
			containerDiv;

			constructor(position, draggable, pane, content) {
				super();
				this.position = position;
				this.draggable = draggable;
				this.pane = pane;
				this.content = content;

				this.handleDragDown;
				this.handleDragMove;
				this.handleDragLeave;
				this.handleDragUp;

				this.createDiv();
			}

			createDiv() {
				this.containerDiv = document.createElement('div');
				this.containerDiv.appendChild(this.content);
				this.containerDiv.classList.add('g-html-marker-container');

				// TODO: Any other events?
				// TODO: clickable moderates which events?
				// TODO: draggable moderates which events?
				[
					'mouseover',
					'mouseout',
					'mouseenter',
					'mouseleave',
					'click',
					'touchstart',
					'touchend'
				].forEach(event => {
					google.maps.event.addDomListener(
						this.containerDiv,
						event,
						() => google.maps.event.trigger(this, event, {
							latLng: this.getPosition(),
						})
					);
				});

				// Optionally stop clicks, etc., from bubbling up to the map.
				//HtmlMarker.preventMapHitsAndGesturesFrom(this.containerDiv);
			}

			appendDivToPane() {
				const panes = this.getPanes();
				panes[this.pane].appendChild(this.containerDiv);
			}

			attachEvents() {
				if (!this.draggable) {
					google.maps.event.removeListener(this.handleDragLeave);
					google.maps.event.removeListener(this.handleDragDown);
					google.maps.event.removeListener(this.handleDragMove);
					google.maps.event.removeListener(this.handleDragUp);

					this.getMap().setOptions({
						gestureHandling: 'greedy',
					});
					return;
				}

				// Trigger mouseup when leaving area
				this.handleDragLeave = google.maps.event.addDomListener(this.containerDiv,
					'mouseleave',
					() => google.maps.event.trigger(this.containerDiv, 'mouseup'),
				);

				let origin;
				this.handleDragDown = google.maps.event.addDomListener(
					this.containerDiv,
					'mousedown',
					e => {
						google.maps.event.trigger(this, 'dragstart', {
							latLng: this.position,
						});
						this.getMap().setOptions({
							gestureHandling: 'none',
						});

						origin = e;
						this.handleDragMove = google.maps.event.addDomListener(
							this.getMap().getDiv(),
							'mousemove',
							e => {
								const deltas = {
									x: origin.clientX - e.clientX,
									y: origin.clientY - e.clientY,
								};
								const pos = this.getProjection()
									.fromLatLngToDivPixel(this.position);
								const latLng = this.getProjection()
									.fromDivPixelToLatLng(new google.maps.Point(
										pos.x-deltas.x,
										pos.y-deltas.y,
									));

								this.position = latLng;
								this.positionDiv();
								google.maps.event.trigger(this, 'drag', {
									latLng: this.position,
								});
								origin = e;
							}
						);

					}
				);

				this.handleDragUp = google.maps.event.addDomListener(
					this.containerDiv,
					'mouseup',
					() => {
						google.maps.event.removeListener(this.handleDragMove);

						this.getMap().setOptions({
							gestureHandling: 'greedy',
						});

						google.maps.event.trigger(this, 'dragend', {
							latLng: this.position,
						});
					},
				);
			}

			positionDiv() {
				const point = this.getProjection().fromLatLngToDivPixel(this.position);
				// Size of the div is intended to be compensated for by CSS class with absolute position
				if (point) {
					this.containerDiv.style.left = `${point.x}px`;
					this.containerDiv.style.top = `${point.y}px`;
				}
			}

			onAdd() {
				this.appendDivToPane();
				this.attachEvents();
			}

			onRemove() {
				// FIXME: parentElement or parentNode?
				if (this.containerDiv.parentElement) {
					this.containerDiv.parentElement.removeChild(this.containerDiv);
					this.containerDiv = null;
				}
			}

			draw() {
				if (!this.containerDiv) {
					this.createDiv();
					this.appendDivToPane();
				}
				this.positionDiv();
			}

			getPosition() {
				return this.position;
			}

			getDraggable() {
				return this.draggable;
			}

			setDraggable(draggable) {
				this.draggable = draggable;
				this.attachEvents();
				// TODO: Emit draggable_changed
			}
		};

		this.mapObject = new HtmlMarker(
			// FIXME: Accept array or object...
			//_.isObject(this.position) ? this.position : google.maps.LatLng(...this.position),
			new google.maps.LatLng(...this.position),
			this.draggable,
			this.pane,
			this.$el
		);
		this.mapObject.setMap(this.map.mapObject);

		this.$watch('draggable', () => this.mapObject.setDraggable(this.draggable));

		// TODO: Any other events?
		// TODO: clickable moderates which events?
		// TODO: draggable moderates which events?
		this.mapObject.addListener('dragend', e => {
			const evt = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
			};
			this.$emit('update:latLng', evt);
			this.$emit('update:lat-lng', evt);
		});

		this.mapObject.addListener('mouseover', e => this.$emit('mouseover', e));
		this.mapObject.addListener('mouseout', e => this.$emit('mouseout', e));
		this.mapObject.addListener('click', e => this.$emit('click', e));

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
