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
		initWatchers() {
			this.$watch('center', () => {
				if (_.isArray(this.center)) {
					if (_.isFunction(this.mapObject.getCenter) && _.isObject(this.mapObject.getCenter())) {
						if (this.center[0] !== this.mapObject.getCenter().lat() && this.center[1] !== this.mapObject.getCenter().lng())
							this.smoothPanTo(
								{
									lat: this.center[0],
									lng: this.center[1],
								}
							);
					} else {
						// FIXME: Not testing if it's the same?
						this.smoothPanTo(
							{
								lat: this.center[0],
								lng: this.center[1],
							}
						);
					}
				} else if (_.isObject(this.center) && _.has(this.center, 'lat') && _.has(this.center, 'lng')) {
					if (_.isFunction(this.mapObject.getCenter) && _.isObject(this.mapObject.getCenter())) {
						if (this.center?.lat !== this.mapObject.getCenter().lat() && this.center?.lng !== this.mapObject.getCenter().lng())
							this.smoothPanTo(
								this.center,
							);
					} else {
						// FIXME: Not testing if it's the same?
						this.smoothPanTo(
							this.center,
						);
					}
				} else {
					console.warn('Invalid "center" provided', JSON.stringify(this.center, null, 2));
				}
			}, { immediate: true, }); // TODO: deep?

			this.$watch('heading', () => {
				if (this.heading !== this.mapObject.getHeading())
					this.mapObject.setHeading(this.heading);
			}, { immediate: true });

			this.$watch('zoom', () => {
				if (this.isPanning) { // Must wait for panning to complete
					// FIXME: Some potential fragility here in that we're relying on this "zoom_changed" not being the first zoom out event
					google.maps.event.addListenerOnce(this.mapObject, 'zoom_changed', () => this.smoothZoom(this.zoom));
				} else if (this.zoom !== this.mapObject.getZoom()) {
					// TODO: Waiting for idle a good idea?
					//google.maps.event.addListenerOnce(this.mapObject, 'idle', () => {
						this.smoothZoom(this.zoom);
					//});
				}
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