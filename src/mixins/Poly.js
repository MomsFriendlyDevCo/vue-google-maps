import Utils from './Utils';
import Path from './Path';

export default {
	mixins: [Utils, Path],
	data() { return {
		listeners: {},
	}},
	props: {
		latLngs: {
			type: Array,
			default: () => [],
		},
		clickable: {
			type: Boolean,
			default: true,
		},
		draggable: {
			type: Boolean,
			default: false,
		},
		editable: {
			type: Boolean,
			default: false,
		},
		visible: {
			type: Boolean,
			default: true,
		},
		zIndex: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		// TODO: Offer ghost marker which is removed once drawing beings
		startCreate() {
			this.map.mapObject.setOptions({ draggableCursor: 'crosshair' });

			// TODO: Creation: Polyline until closed then becomes polygon?
			// Reset to be sure we're always creating from the start
			this.mapObject.setPath(new google.maps.MVCArray());

			const path = this.mapObject.getPath();
			let pathIdx = 0;

			this.listeners.handleMapClick = this.map.mapObject.addListener('click', e => {
				//console.log('click', e.latLng.toUrlValue(6), pathIdx);
				google.maps.event.removeListener(this.listeners.handleMapClick);

				if (pathIdx === 0) {
					path.setAt(pathIdx++, e.latLng);

					// FIXME: Only listening to events on top of polyline being created
					this.listeners.handleMapMousemove = this.map.mapObject.addListener('mousemove', e => {
						//console.log('mousemove', e.latLng.toUrlValue(6), pathIdx);
						path.setAt(pathIdx, e.latLng);
					});

					// NOTE: These polyline level events only take precidence when polyline is in "editable" mode
					this.listeners.handleLineClick = this.mapObject.addListener('click', e => {
						//console.log('line click', e.latLng.toUrlValue(6));
						pathIdx++;
					});

					this.listeners.handleLineDblClick = this.mapObject.addListener('dblclick', e => {
						//console.log('line dblclick', e.latLng.toUrlValue(6));
						this.finishCreate();
					});

					this.listeners.handleKeyUp = e => {
						//console.log('keyup', e, e.key);
						switch (e.key) {
							case 'Enter':
								this.finishCreate();
								break;
							case 'Escape':
								this.finishCreate(true);
								break;
						}
					};
					window.addEventListener('keyup', this.listeners.handleKeyUp);

					this.listeners.handleEditable = this.$watch('editable', (newVal, oldVal) => {
						if (oldVal && !newVal) this.finishCreate();
					});

					// End creation mode if position is updated externally
					this.listeners.handlePosition = this.$watch('latLngs', () => {
						if (this.latLngs && this.latLngs.length > 0) this.finishCreate();
					});
				} else {
					pathIdx++;
				}
			});
		},


		finishCreate(reset = false) {
			this.map.mapObject.setOptions({ draggableCursor: null });
			if (this.listeners?.handleMapClick) google.maps.event.removeListener(this.listeners.handleMapClick);
			if (this.listeners?.handleMapMousemove) google.maps.event.removeListener(this.listeners.handleMapMousemove);
			if (this.listeners?.handleLineClick) google.maps.event.removeListener(this.listeners.handleLineClick);
			if (this.listeners?.handleLineDblClick) google.maps.event.removeListener(this.listeners.handleLineDblClick);
			if (this.listeners?.handleKeyUp) window.removeEventListener('keyup', this.listeners.handleKeyUp);
			if (this.listeners?.handleEditable) this.listeners.handleEditable();
			if (this.listeners?.handlePosition) this.listeners.handlePosition();

			if (reset) this.mapObject.setPath(new google.maps.MVCArray(this.path));

			this.update();
		},
	},
};
