import { useRef, useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const Autocompleteinput = () => {
  const map = useMap();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    
    // check if the google.maps.places library is loaded
    if (!window.google || !window.google.maps.places) {
			console.error("Google Maps Places library is not loaded.");
			return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
			fields: ["geometry", "name"],
    });

    // handle the place selection
    autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			if (place.geometry && place.geometry.location) {
				// center the map on the selected place
				map.setCenter(place.geometry.location);
				map.setZoom(15);
			}
    });

    return () => {};
  }, [map]);

  return (
    <div style={{ padding: '10px', backgroundColor: 'white', margin: '10px', borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,.3)' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search location..."
        style={{ width: '300px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
    </div>
  );
};
export default Autocompleteinput;