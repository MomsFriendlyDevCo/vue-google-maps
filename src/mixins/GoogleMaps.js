export default {
	props: {
		/**
		 * Google Maps API key
		 */
		apiKey: {
			type: String,
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