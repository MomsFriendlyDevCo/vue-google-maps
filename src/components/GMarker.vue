<script>
//import { optionsMerger, propsBinder, debounce } from '../utils/utils.js';
//import Layer from '../mixins/Layer.js';
import Utils from '../mixins/Utils.js';
import Options from '../mixins/Options.js';
//import { CRS, DomEvent, map, latLngBounds, latLng } from 'leaflet';

//import Debug from '@doop/debug';
//const $debug = Debug('vue-google-maps/GMarker').enable(false);

/**
 * Marker component
 */
export default {
	name: 'GMarker',
	mixins: [Utils, Options],
	inject: ['map'],
	props: {
		/*
		pane: {
			type: String,
			default: 'markerPane',
		},
		*/
		clickable: {
			type: Boolean,
			default: true,
		},
		draggable: {
			type: Boolean,
			default: false,
		},
		// In the context of markers used only for creation. Not understood by Google Maps
		editable: {
			type: Boolean,
			default: false,
		},
		position: {
			type: [Object, Array],
			default: null,
		},
		label: {
			type: Object,
			default: null,
		},
		icon: {
			type: Object,
			default: () => ({
				anchor: new google.maps.Point(15, 30),
				path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
				//anchor: new google.maps.Point(36 / 2, 58),
				//path: 'M 17.99948,5e-5 C 8.05897,2.6e-4 0,9.33048 0,20.84053 0.004,24.9139 0.80724,28.62632 2.97511,32.29711 l 0.0121,0.0225 L 17.99144,58 32.87917,32.41379 C 34.53508,28.85553 35.9424,25.39911 35.99998,20.84115 35.99993,9.33109 27.94101,6e-5 17.99946,6.7e-4 Z',
				fillColor: 'blue',
				fillOpacity: 0.8,
				strokeWeight: 0.8,
				rotation: 0,
				scale: 1,
			}),
		},
		shape: {
			type: Object,
			default: null,
		},
		/*
		opacity: {
			type: Number,
			custom: false,
			default: 1.0,
		},
		*/
		visible: {
			type: Boolean,
			default: true,
		},
		zIndex: {
			type: Number,
			default: 0,
		},
	},
	data() { return {
		ready: false,
		listeners: {},
	}},
	beforeDestroy() {
		this.mapObject.setMap(null);
	},
	// TODO: Encapsulate for use with HtmlMarker also
	methods: {
		// TODO: Offer ghost version of the marker which is removed and replaced with the actual one once placed
		startCreate() {
			this.map.mapObject.setOptions({ draggableCursor: 'crosshair' });
			this.listeners.handleMapClick = this.map.mapObject.addListener('click', e => {
				console.log('click', e.latLng.toUrlValue(6));
				google.maps.event.removeListener(this.listeners.handleMapClick);

				this.mapObject.setPosition(e.latLng);

				// TODO: Do something with <ESC> key?

				this.finishCreate();
			});

			this.listeners.handleEditable = this.$watch('editable', (newVal, oldVal) => {
				if (oldVal && !newVal) this.finishCreate();
			});

			// End creation mode if position is updated externally
			this.listeners.handlePosition = this.$watch('position', () => {
				if (this.position) this.finishCreate();
			});
		},
		finishCreate(reset = false) {
			this.map.mapObject.setOptions({ draggableCursor: null });
			if (this.listeners?.handleMapClick) google.maps.event.removeListener(this.listeners.handleMapClick);
			if (this.listeners?.handleEditable) this.listeners.handleEditable();
			if (this.listeners?.handlePosition) this.listeners.handlePosition();

			if (reset) this.mapObject.setPosition(new google.maps.LatLng(this.convertLatLng(this.position)));

			this.update();
		},
		update() {
			const p = this.mapObject.getPosition();
			if (!p) return;

			const evt = { lat: p.lat(), lng: p.lng() };
			this.$emit('update:latLng', evt);
			this.$emit('update:lat-lng', evt);
		},
	},
	mounted() {
		this.mapObject = new google.maps.Marker({
			position: (this.position) ? new google.maps.LatLng(this.convertLatLng(this.position)) : undefined,
			clickable: this.clickable,
			draggable: this.draggable,
			label: this.label,
			icon: this.icon,
			shape: this.shape,
			title: this.label?.text || '',
			map: this.map.mapObject,
			visible: this.visible,
			zIndex: this.zIndex,
		});

		this.$watch('position', () => {
			if (this.position) this.mapObject.setPosition(new google.maps.LatLng(this.convertLatLng(this.position)));
		});
		this.$watch('clickable', () => this.mapObject.setClickable(this.clickable));
		this.$watch('draggable', () => this.mapObject.setDraggable(this.draggable));
		this.$watch('visible', () => this.mapObject.setVisible(this.visible));
		this.$watch('zIndex', () => this.mapObject.setZIndex(this.zIndex));

		this.$watchAll(['label', 'icon', 'shape'], () => {
			this.mapObject.setOptions({
				label: this.label,
				icon: this.icon,
				shape: this.shape,
			})
		}, { deep: true });

		// TODO: Some kind of binding helper?

		// Google Maps events:
		// animation_changed, click, clickable_changed, contextmenu, cursor_changed, dblclick, 
		// drag, dragend, draggable_changed, dragstart, flat_changed, icon_changed, 
		// mousedown, mouseout, mouseover, mouseup, position_changed, rightclick, 
		// shape_changed, title_changed, visible_changed, zindex_changed

		/*
		// Is this pattern better at handling internal events?
		google.maps.event.addListener(this.mapObject, 'mouseover', e => {
			console.log('mouseover', 'google', e);
			//this.$emit('mouseover', e);
		});
		*/

		// FIXME: Also test if position is empty?
		if (this.editable && !this.position) this.startCreate();

		this.mapObject.addListener('dragend', e => {
			if (!this.draggable) return;

			const evt = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
			};
			this.$emit('update:latLng', evt);
			this.$emit('update:lat-lng', evt);
		});

		this.mapObject.addListener('mouseover', e => this.$emit('mouseover', e));
		this.mapObject.addListener('mouseout', e => this.$emit('mouseout', e));
		this.mapObject.addListener('click', e => {
			if (!this.clickable) return;

			this.$emit('click', e);
		});

		/*
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
				this.mapObject, // TODO: this.$el?
				event,
				() => google.maps.event.trigger(this, event, {
					latLng: this.getPosition(),
				})
			);
		});
		*/

		this.ready = true;
	},
	render: function(h) {
		// FIXME: Node cannot be found in the current page
		if (this.ready && this.$slots.default) {
			return h('div', { style: { display: 'none' } }, this.$slots.default);
		}
		return null;
	},
};
</script>

