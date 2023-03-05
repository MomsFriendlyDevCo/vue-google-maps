export default {
	data() { return {
		pendingSmooth: null,
		pendingZoom: null,
	}},
	methods: {
		/**
		 * Ensure center is the expected position
		 * @param {Object} destLatLng Destination latLng
		 */
		checkCenter(destLatLng) {
			if (!this.mapObject.getCenter().equals(new google.maps.LatLng(destLatLng)))
				this.mapObject.panTo(destLatLng);
		},


		/**
		 * Wait for any pending motion before starting a pan
		 * 
		 * @param {Array} destLatLng Destination latLng
		 * @returns {Promise}
		 */
		doPan(destLatLng) {
			// Check if we're already in position
			if (_.isFunction(this.mapObject.getCenter) && !_.isEmpty(this.mapObject.getCenter())) {
				if (this.mapObject.getCenter().equals(new google.maps.LatLng(destLatLng))) // Check if we're already there
					return Promise.resolve();
			}
			//console.log('doPan', destLatLng);

			let listener;
			return new Promise((resolve, reject) => {
				listener = google.maps.event.addListener(this.mapObject, 'idle', () => {
					// Validate reached destination?
					/*
					// FIXME: This is disjointed; Validation is, valid however any adjustments made as this time will be clunky.
					const precision = 9; // Close enough is good enough
					if (
						_.round(destLatLng.lat, precision) === _.round(this.mapObject.getCenter().lat(), precision) &&
						_.round(destLatLng.lng, precision) === _.round(this.mapObject.getCenter().lng(), precision)) {
						if (listener) google.maps.event.removeListener(listener);
						resolve();
					} else {
						console.log('doPan.again', destLatLng, [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()]);
						//this.mapObject.setZoom(this.mapObject.getZoom() + 0.01); // NOTE: Hack to get within "maxBounds"
						this.mapObject.panTo(destLatLng);
					}
					*/
					if (listener) google.maps.event.removeListener(listener);
					//console.log('doPan.resolve', destLatLng);
					resolve();
				});
				this.mapObject.panTo(destLatLng);
			});
		},


		/**
		 * Pan in a step-wise manner
		 * 
		 * @see https://stackoverflow.com/a/52763732/2438830
		 * 
		 * @param {Object} destLatLng Destination latLng
		 * @returns {Promise}
		 */
		smoothPanTo(destLatLng) {
			// Check if we're already in position
			if (_.isFunction(this.mapObject.getCenter) && !_.isEmpty(this.mapObject.getCenter())) {
				if (this.mapObject.getCenter().equals(new google.maps.LatLng(destLatLng))) // Check if we're already there
					return Promise.resolve();
			}
			//console.log('smoothPanTo', destLatLng);

			// Helper Functions {{{
			/**
			 * Handy functions to project lat/lng to pixel
			 * Extracted from: https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
			 * @todo: Is there a function for this in the API?
			 **/
			const getPixel = (latLng, zoom) => {
				var scale = 1 << zoom
				var worldCoordinate = this.mapObject.getProjection().fromLatLngToPoint(latLng);
				return new google.maps.Point(
						Math.floor(worldCoordinate.x * scale),
						Math.floor(worldCoordinate.y * scale))
			};

			/**
			 * Given a map, return the map dimension (width and height)
			 * in pixels.
			 **/
			const getMapDimenInPixels = () => {
				var zoom = this.mapObject.getZoom()
				var bounds = this.mapObject.getBounds()

				var southWestPixel = getPixel(bounds.getSouthWest(), zoom)
				var northEastPixel = getPixel(bounds.getNorthEast(), zoom)
				return {
					width: Math.abs(southWestPixel.x - northEastPixel.x),
					height: Math.abs(southWestPixel.y - northEastPixel.y)
				}
			};

			/**
			 * Given a map and a destLatLng returns true if calling
			 * map.panTo(destLatLng) will be smoothly animated or false
			 * otherwise.
			 *
			 * optionalZoomLevel can be optionally be provided and if so
			 * returns true if map.panTo(destLatLng) would be smoothly animated
			 * at optionalZoomLevel.
			 **/
			const willAnimatePanTo = (destLatLng, optionalZoomLevel) => {
				if (this.mapObject.getBounds() === null) return true; // FIXME: Does no bounds really mean always true?

				var dimen = getMapDimenInPixels()

				var mapCenter = this.mapObject.getCenter()
				optionalZoomLevel = !!optionalZoomLevel ? optionalZoomLevel : this.mapObject.getZoom()

				var destPixel = getPixel(destLatLng, optionalZoomLevel)
				var mapPixel = getPixel(mapCenter, optionalZoomLevel)
				var diffX = Math.abs(destPixel.x - mapPixel.x)
				var diffY = Math.abs(destPixel.y - mapPixel.y)

				return (diffX < dimen.width && diffY < dimen.height)
			};

			/**
			 * Returns the optimal zoom value when animating 
			 * the zoom out.
			 *
			 * The maximum change will be currentZoom - 3.
			 * Changing the zoom with a difference greater than 
			 * 3 levels will cause the map to "jump" and not
			 * smoothly animate.
			 *
			 * Unfortunately the magical number "3" was empirically
			 * determined as we could not find any official docs
			 * about it.
			 **/
			const getOptimalZoomOut = (latLng, currentZoom) => {
				// TODO: Check "minZoom"?
				if(willAnimatePanTo(latLng, currentZoom - 1)) {
					return currentZoom - 1
				} else if(willAnimatePanTo(latLng, currentZoom - 2)) {
					return currentZoom - 2
				} else {
					return currentZoom - 3
				}
			};
			// }}}

			/**
			 * Given a map and a destLatLng, smoothly animates the map center to
			 * destLatLng by zooming out until distance (in pixels) between map center
			 * and destLatLng are less than map width and height, then panTo to destLatLng
			 * and finally animate to restore the initial zoom.
			 *
			 * optionalAnimationEndCallback can be optionally be provided and if so
			 * it will be called when the animation ends
			 **/
			const smoothPanToWorkAround = (destLatLng) => {
				let listener;

				return new Promise((resolve, reject) => {
					const zoomIn = () => {
						//console.log('zoomIn', this.mapObject.getZoom(), this.pendingZoom);
						if(this.mapObject.getZoom() < this.pendingZoom) {
							this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, this.pendingZoom));
							this.checkCenter(destLatLng);
						} else {
							if (listener) google.maps.event.removeListener(listener);
	
							// TODO: Remove any special options
							//this.mapObject.setOptions({draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false})
	
							//console.log('smoothPanToWorkAround.resolve', destLatLng);
							resolve();
						}
					};
	
					const zoomOut = () => {
						//console.log('zoomOut', willAnimatePanTo(destLatLng));
						if(willAnimatePanTo(destLatLng)) {
							if (listener) google.maps.event.removeListener(listener);
							this.doPan(destLatLng).then(() => {
								listener = google.maps.event.addListener(this.mapObject, 'idle', zoomIn);
								zoomIn();
							});
						} else {
							this.mapObject.setZoom(getOptimalZoomOut(destLatLng, this.mapObject.getZoom()));
						}
					};
	
					// TODO: Re-apply special options
					//this.mapObject.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true})

					this.mapObject.setZoom(getOptimalZoomOut(destLatLng, this.pendingZoom));
					listener = google.maps.event.addListener(this.mapObject, 'idle', zoomOut);
				})
			}

			this.pendingZoom = this.mapObject.getZoom();
			return this.pendingSmooth = Promise.resolve(this.pendingSmooth)
				.then(() => (willAnimatePanTo(destLatLng))
					? this.doPan(destLatLng)
					: smoothPanToWorkAround(destLatLng)
				)
				.finally(() => {
					this.pendingSmooth = null;
					this.pendingZoom = null;
					// NOTE: Not emitting as circular
					//console.log('smoothPanTo.moveend', [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()]);
					//this.$emit('moveend', [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()]);
				});
		},


		/**
		 * Zoom in a step-wise manner
		 * 
		 * @param {number} zoom Intended final zoom level
		 * @param {Object} destLatLng Destination position
		 * @returns {Promise}
		 */
		doZoom(zoom, destLatLng) {
			if (zoom === this.mapObject.getZoom()) return Promise.resolve();
			//console.log('doZoom', zoom, destLatLng);
			let listener;

			return new Promise(resolve => {
				listener = google.maps.event.addListener(this.mapObject, 'idle', () => {
					if(this.mapObject.getZoom() < zoom) {
						//console.log('zoom in again', zoom, this.mapObject.getZoom(), Math.min(this.mapObject.getZoom() + 3, zoom))
						this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, zoom));
						this.checkCenter(destLatLng);
					} else if(this.mapObject.getZoom() > zoom) {
						//console.log('zoom out again', zoom, this.mapObject.getZoom(), Math.max(this.mapObject.getZoom() - 3, zoom))
						this.mapObject.setZoom(Math.max(this.mapObject.getZoom() - 3, zoom));
						this.checkCenter(destLatLng);
					} else {
						if (listener) google.maps.event.removeListener(listener);

						this.checkCenter(destLatLng);
						//console.log('doZoom.resolve', zoom);
						resolve();
					}
				});
				if(this.mapObject.getZoom() < zoom) {
					//console.log('zoom in', zoom, this.mapObject.getZoom(), Math.min(this.mapObject.getZoom() + 3, zoom))
					this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, zoom));
				} else if(this.mapObject.getZoom() > zoom) {
					//console.log('zoom out', zoom, this.mapObject.getZoom(), Math.max(this.mapObject.getZoom() - 3, zoom))
					this.mapObject.setZoom(Math.max(this.mapObject.getZoom() - 3, zoom));
				}
			});
		},


		/**
		 * Wait for any pending motion before starting a zoom
		 * 
		 * @param {number} zoom Intended final zoom level
		 * @param {Object} destLatLng Destination position
		 * @returns {Promise}
		 */
		smoothZoom(zoom, destLatLng) {
			if (zoom === this.mapObject.getZoom()) return Promise.resolve();
			//console.log('smoothZoom', zoom, destLatLng);

			// FIXME: Any need for a heuristic here? Only setting when larger or smaller?
			// FIXME: Should this entire block wait for "$nextTick"?
			this.pendingZoom = zoom; // Inform any pending promise of this change to our intended final zoom
			return this.pendingSmooth = Promise.resolve(this.pendingSmooth)
				.then(() => this.$nextTick()) // When center and zoom are updated at the same time; Do zoom second.
				// FIXME: We were waiting for the other smooth to complete here... What if it didn't exist until the next tick
				.then(() => this.doZoom(zoom, destLatLng))
				.finally(() => {
					this.pendingSmooth = null;
					// NOTE: Not emitting as circular
					//console.log('smoothZoom.zoomend', this.mapObject.getZoom());
					//this.$emit('zoomend', this.mapObject.getZoom());
				});
			
		},
	},
};


