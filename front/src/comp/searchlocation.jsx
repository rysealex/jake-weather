import { useRef, useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import '../index.css';

const Searchlocation = () => {
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
    <div className="global-search">
      <input
        className="search-input" 
        id="searchInput"
        ref={inputRef}
        type="text"
        placeholder="Search location..."
      />
      <button className="search-btn" id="searchBtn">🔍</button>
    </div>
  );
};
export default Searchlocation;