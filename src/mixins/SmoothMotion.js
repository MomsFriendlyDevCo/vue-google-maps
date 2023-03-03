export default {
	data() { return {
		isPanning: false,
		isZooming: false,
	}},
	methods: {
		/**
		 * Pan in a step-wise manner
		 * 
		 * @see https://stackoverflow.com/a/52763732/2438830
		 * 
		 * @param {Array} destLatLng Destination latLng
		 * @returns {Promise}
		 */
		smoothPanTo(destLatLng) {
			/**
			 * Handy functions to project lat/lng to pixel
			 * Extracted from: https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
			 **/
			const project = (latLng) => {
				var TILE_SIZE = 256 // TODO: When using a custom mapType like "TileLayer" we'll need to use it's size

				var siny = Math.sin(((_.isFunction(latLng.lat)) ? latLng.lat() : latLng.lat) * Math.PI / 180)

				// Truncating to 0.9999 effectively limits latitude to 89.189. This is
				// about a third of a tile past the edge of the world tile.
				siny = Math.min(Math.max(siny, -0.9999), 0.9999)

				return new google.maps.Point(
					TILE_SIZE * (0.5 + ((_.isFunction(latLng.lng)) ? latLng.lng() : latLng.lng) / 360),
					TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)))
			};

			/**
			 * Handy functions to project lat/lng to pixel
			 * Extracted from: https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
			 **/
			const getPixel = (latLng, zoom) => {
				var scale = 1 << zoom
				var worldCoordinate = project(latLng)
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
				if (this.mapObject.getBounds() === null) return true;

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
			}

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
				const initialZoom = this.mapObject.getZoom();
				let listener;
				this.isPanning = true;

				return new Promise((resolve, reject) => {
					const zoomIn = () => {
						if(this.mapObject.getZoom() < initialZoom) {
							this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, initialZoom));
						} else {
							if (listener) google.maps.event.removeListener(listener);
	
							// TODO: Remove any special options
							//this.mapObject.setOptions({draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false})
	
							//google.maps.event.addListenerOnce(this.mapObject, 'idle', () => {
								this.isPanning = false;
								resolve();
							//});
						}
					};
	
					const zoomOut = () => {
						if(willAnimatePanTo(destLatLng)) {
							if (listener) google.maps.event.removeListener(listener);
							listener = google.maps.event.addListener(this.mapObject, 'idle', zoomIn);
							this.mapObject.panTo(destLatLng);
						} else {
							this.mapObject.setZoom(getOptimalZoomOut(destLatLng, this.mapObject.getZoom()));
						}
					};
	
					// TODO: Re-apply special options
					//this.mapObject.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true})

					this.mapObject.setZoom(getOptimalZoomOut(destLatLng, initialZoom));
					listener = google.maps.event.addListener(this.mapObject, 'idle', zoomOut);
				})
			}

			if(willAnimatePanTo(destLatLng)) {
				this.mapObject.panTo(destLatLng);
				google.maps.event.addListenerOnce(this.mapObject, 'idle', () => {
					this.$emit('moveend', [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()])
				});
			} else {
				smoothPanToWorkAround(destLatLng)
					.then(() => {
						this.$emit('moveend', [this.mapObject.getCenter().lat(), this.mapObject.getCenter().lng()])
					});
			}
		},

		/**
		 * Zoom in a step-wise manner
		 * 
		 * @param {number} zoom Intended final zoom level
		 * @returns {Promise}
		 */
		smoothZoom(zoom) {
			let listener;
			this.isZooming = true;

			return new Promise((resolve, reject) => {
				const zoomIn = () => {
					if(this.mapObject.getZoom() < zoom) {
						this.mapObject.setZoom(Math.min(this.mapObject.getZoom() + 3, zoom));
					} else {
						if (listener) google.maps.event.removeListener(listener);

						this.isZooming = true;
						resolve();
					}
				};

				listener = google.maps.event.addListener(this.mapObject, 'idle', zoomIn);
			})
			.then(() => {
				this.$emit('zoomend', this.mapObject.getZoom())
			})
			
		},
	},
};


