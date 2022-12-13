export default {
	props: {
		/**
		 * Google Maps API key
		 */
		apiKey: {
			type: String,
		},
	},
	methods: {
		initWatchers() {
			this.$watch('center', () => {
				if (_.isArray(this.center)) {
					if (_.isFunction(this.mapObject.getCenter) && _.isObject(this.mapObject.getCenter())) {
						if (this.center[0] !== this.mapObject.getCenter().lat() && this.center[1] !== this.mapObject.getCenter().lng())
							this.mapObject.setCenter({
								lat: this.center[0],
								lng: this.center[1],
							});
					} else {
						this.mapObject.setCenter({
							lat: this.center[0],
							lng: this.center[1],
						});
					}
				} else if (_.isObject(this.center) && _.has(this.center, 'lat') && _.has(this.center, 'lng')) {
					if (_.isFunction(this.mapObject.getCenter) && _.isObject(this.mapObject.getCenter())) {
						if (this.center?.lat !== this.mapObject.getCenter().lat() && this.center?.lng !== this.mapObject.getCenter().lng())
							this.mapObject.setCenter(this.center);
					} else {
						this.mapObject.setCenter(this.center);
					}
				} else {
					console.warn('Invalid "center" provided', JSON.stringify(this.center, null, 2));
				}
			}, { immediate: true });

			this.$watch('heading', () => {
				if (this.heading !== this.mapObject.getHeading())
					this.mapObject.setHeading(this.heading);
			}, { immediate: true });

			this.$watch('zoom', () => {
				if (this.zoom !== this.mapObject.getZoom())
					this.mapObject.setZoom(this.zoom);
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
		if (typeof google === 'undefined') {
			window.initGoogleMaps = this.initGoogleMaps; // Globally accessible callback for Google
			const script = document.createElement('script');
			//script.async = true; // NOTE: Fires callback with or without...
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?v=beta&callback=initGoogleMaps';
			if (this.$props.apiKey) script.src += `&key=${this.$props.apiKey}`;
			document.body.appendChild(script);
		} else {
			this.initGoogleMaps();
		}
	},
};