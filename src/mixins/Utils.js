export default {
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
	},
};