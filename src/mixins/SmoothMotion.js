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
			console.log('smoothPanTo', destLatLng);

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

				const dimen = getMapDimenInPixels();
				const mapCenter = this.mapObject.getCenter();
				optionalZoomLevel = !!optionalZoomLevel ? optionalZoomLevel : this.mapObject.getZoom();

				const destPixel = getPixel(destLatLng, optionalZoomLevel);
				const mapPixel = getPixel(mapCenter, optionalZoomLevel);
				const diffX = Math.abs(destPixel.x - mapPixel.x);
				const diffY = Math.abs(destPixel.y - mapPixel.y);

				return (diffX < dimen.width && diffY < dimen.height);
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
				//console.log('getOptimalZoomOut', latLng, currentZoom);
				let res;
				if (willAnimatePanTo(latLng, currentZoom - 1)) {
					res = currentZoom - 1;
				} else if(willAnimatePanTo(latLng, currentZoom - 2)) {
					res = currentZoom - 2;
				} else {
					res = currentZoom - 3;
				}

				/*
				// TODO: Good, but async...
				this.mapMaxZoomService = new google.maps.MaxZoomService();
				this.mapMaxZoomService.getMaxZoomAtLatLng(latLng)
					.then(maxZoom => {
						console.log('maxZoom', maxZoom);
					})
					.catch(e => {
						console.log('maxZoom.e', e);
					})
				*/

				const min = Math.min(this.mapObject.minZoom, 1);
				const max = Math.max(this.mapObject.maxZoom, 24);
				const out = Math.min(Math.max(res, max), min);
				//console.log('getOptimalZoomOut.out', out);
				return out;
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
						//console.log('smoothPanTo.zoomIn', this.pendingZoom, this.mapObject.getZoom());
						const zoom = this.mapObject.getZoom();
						if(zoom < this.pendingZoom) {
							// FIXME: hmm? We already know one is less than other, before adding 3
							this.mapObject.setZoom(Math.min(zoom + 3, this.pendingZoom));
							this.checkCenter(destLatLng);
						} else {
							if (listener) google.maps.event.removeListener(listener);
	
							// TODO: Remove any special options
							//this.mapObject.setOptions({draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false})
	
							//console.log('smoothPanToWorkAround.resolve', destLatLng);
							this.mapObject.setZoom(this.pendingZoom);
							this.checkCenter(destLatLng);
							resolve();
						}
					};
	
					const zoomOut = () => {
						//console.log('smoothPanTo.zoomOut', willAnimatePanTo(destLatLng));
						const zoom = this.mapObject.getZoom();
						const optimal = getOptimalZoomOut(destLatLng, this.mapObject.getZoom());
						//console.log('smoothPanTo.zoomOut.optimal', zoom, optimal);
						if(zoom === optimal) {
							//console.log('smoothPanTo.zoomOut', 'zoomIn', destLatLng);
							if (listener) google.maps.event.removeListener(listener);
							listener = google.maps.event.addListener(this.mapObject, 'idle', zoomIn);
							zoomIn();
						} else if (willAnimatePanTo(destLatLng)) {
							//console.log('smoothPanTo.zoomOut', 'pan', destLatLng);
							if (listener) google.maps.event.removeListener(listener);
							this.doPan(destLatLng).then(() => {
								listener = google.maps.event.addListener(this.mapObject, 'idle', zoomIn);
								zoomIn();
							});
						} else {
							//console.log('smoothPanTo.zoomOut', 'zoom', zoom, optimal);
							this.mapObject.setZoom(optimal);
						}
					};
	
					// TODO: Re-apply special options
					//this.mapObject.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true})

					listener = google.maps.event.addListener(this.mapObject, 'idle', zoomOut);
					zoomOut();
				})
			}

			const zoom = this.mapObject.getZoom();
			// Do nothing when on outer most zoom levels
			if (zoom <= this.mapObject.minZoom + 3) {
				//console.log('smoothPanTo.min', destLatLng, zoom);
				return Promise.resolve()
					.then(() => this.pendingSmooth)
					.finally(() => this.pendingSmooth = null);
			}

			this.pendingZoom = zoom;
			return Promise.resolve()
				.then(() => this.pendingSmooth)
				.then(() => this.pendingSmooth = (willAnimatePanTo(destLatLng)) ? this.doPan(destLatLng) : smoothPanToWorkAround(destLatLng))
				.finally(() => this.pendingSmooth = null);
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
						//console.log('doZoom.zoomIn again', zoom, this.mapObject.getZoom(), Math.min(this.mapObject.getZoom() + 3, zoom))
						this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, zoom));
						this.checkCenter(destLatLng);
					} else if(this.mapObject.getZoom() > zoom) {
						//console.log('doZoom.zoomOut again', zoom, this.mapObject.getZoom(), Math.max(this.mapObject.getZoom() - 3, zoom))
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
					//console.log('doZoom.zoomIn', zoom, this.mapObject.getZoom(), Math.min(this.mapObject.getZoom() + 3, zoom))
					this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, zoom));
				} else if(this.mapObject.getZoom() > zoom) {
					//console.log('doZoom.zoomOut', zoom, this.mapObject.getZoom(), Math.max(this.mapObject.getZoom() - 3, zoom))
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
			this.pendingZoom = zoom; // Update intended final zoom for in-progress motion
			return Promise.resolve()
				.then(() => this.pendingSmooth)
				.then(() => this.$nextTick()) // Things settled enough that we end races in the correct state
				.then(() => this.pendingSmooth = this.doZoom(zoom, destLatLng)) // FIXME: Also use "pendingZoom"?
				.finally(() => this.pendingSmooth = null);
			
		},
	},
};


