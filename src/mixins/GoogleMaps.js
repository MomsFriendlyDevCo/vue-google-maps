export default {
	props: {
		/**
		 * Google Maps API key
		 */
		apiKey: {
			type: String,
		},
		/**
		 * Libraries to load
		 */
		libraries: {
			type: String,
			default: 'places',
		},
	},
	methods: {
		/**
		 * Convert latLng provided as array into object when required
		 * 
		 * @param {Array|Object} latLng Destination position
		 * @returns {Object}
		 */
		convertLatLng(latLng) {
			// NOTE: All of this is simply so that the API supports same objects as LeafletJS. Can likely be removed.
			if (_.isArray(latLng)) {
				return {
					lat: latLng[0],
					lng: latLng[1],
				};
			} else if (_.isObject(latLng) && _.has(latLng, 'lat') && _.has(latLng, 'lng')) {
				return latLng;
			} else {
				console.warn('Invalid "latLng" provided', JSON.stringify(latLng, null, 2));
				return latLng;
			}
		},

		initWatchers() {
			this.$watch('center', () => {
				this.smoothPanTo(this.convertLatLng(this.center));
			}, { immediate: true, }); // TODO: deep?

			this.$watch('heading', () => {
				if (this.heading !== this.mapObject.getHeading())
					this.mapObject.setHeading(this.heading);
			}, { immediate: true });

			this.$watch('zoom', () => {
				this.smoothZoom(this.zoom, this.convertLatLng(this.center));
			}, { immediate: true });

			this.$watch('maxBounds', () => {
				if (this.maxBounds && this.maxBounds.length === 2 && this.maxBounds[0] && this.maxBounds[0].length === 2 && this.maxBounds[1] && this.maxBounds[1].length === 2)
					this.mapObject.setOptions({
						restriction: {
							latLngBounds: {
								north: this.maxBounds[0][0],
								south: this.maxBounds[1][0],
								west: this.maxBounds[1][1],
								east: this.maxBounds[0][1],
							},
							strictBounds: true,
						}
					});
			}, { immediate: true });

			this.$watch('mapTypeId', () => {
				if (this.mapTypeId)
					this.mapObject.setMapTypeId(this.mapTypeId);
			}, { immediate: true });
		},
	},
	beforeDestroy() {
		if (this.mapObject) {
			google.maps.event.clearInstanceListeners(window);
			google.maps.event.clearInstanceListeners(document);
			google.maps.event.clearInstanceListeners(this.$el);
			this.$el.remove(); // FIXME: Reason? Something to do with Google Maps JS handling of multiple elements? If an issue create a sub-element and remove that instead.
			this.mapObject = null;
		}
	},
	mounted() {
		if (_.isUndefined(window?.google)) {
			// Globally accessible callback for Google
			if (_.isFunction(window?.initGoogleMaps)) { // Another exists, wrap it
				const origCallback = window.initGoogleMaps;
				window.initGoogleMaps = () => {
					this.initGoogleMaps();
					origCallback();
				};
			} else {
				window.initGoogleMaps = this.initGoogleMaps;
			}

			const script = document.createElement('script');
			//script.async = true; // NOTE: Fires callback with or without...
			script.type = 'text/javascript';
			// TODO: Property to specifiy which libraries we're interested in loading
			script.src = 'https://maps.googleapis.com/maps/api/js?v=beta&callback=initGoogleMaps';
			if (this.$props.libraries) script.src += `&libraries=${this.$props.libraries}`;
			if (this.$props.apiKey) script.src += `&key=${this.$props.apiKey}`;
			document.body.appendChild(script);
		} else {
			this.initGoogleMaps();
		}
	},
};