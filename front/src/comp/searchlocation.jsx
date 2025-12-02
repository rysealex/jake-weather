import { useRef, useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import '../index.css';

const Searchlocation = () => {
  const map = useMap();
  const inputRef = useRef(null);

  // useState hook for the current autocomplete instance
  const [autocomplete, setAutocomplete] = useState(null);

  // ref for the PlacesService to be initialized once
  const placesServiceRef = useRef(null);

  // useEffect to intialize the autocomplete and PlacesService on search location component mount
  useEffect(() => {
    if (!map) return;
    
    // check if the google.maps.places library is loaded
    if (!window.google || !window.google.maps.places) {
			console.error("Google Maps Places library is not loaded.");
			return;
    }

    const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
			fields: ["geometry", "name"],
    });
    setAutocomplete(newAutocomplete);

    // initialize PlacesService
    placesServiceRef.current = new window.google.maps.places.PlacesService(map);

    // handle the place selection from the autocomplete dropdown
    newAutocomplete.addListener('place_changed', () => {
      const place = newAutocomplete.getPlace();
      handlePlaceResult(place);
    });

    return () => {};
  }, [map]);

  // function to handle a successful place result
  const handlePlaceResult = (place) => {
    if (place.geometry && place.geometry.location) {
      // center the map on the selected place
      map.setCenter(place.geometry.location);
      map.setZoom(15);
      // update the input field with the place name
      inputRef.current.value = place.name;
    } else if (place.name) {
      console.log(`Place found: ${place.name}, but no geometry.`);
    } else {
      console.log("No details available for the selected place.");
    }
  };

  // function to handle the search button click
  const handleSearchClick = () => {
    const query = inputRef.current.value;
    if (!query || !placesServiceRef.current) return;

    const request = {
      query: query,
      fields: ['name', 'geometry'],
    };

    placesServiceRef.current.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const place = results[0]; 
        handlePlaceResult(place);
      } else {
        console.error('Places search failed or returned no results:', status);
      }
    });
  };

  return (
    <div className="global-search" style={{ zIndex: 1000 }}>
      <input
        className="search-input" 
        id="searchInput"
        ref={inputRef}
        type="text"
        placeholder="Search location..."
      />
      <button 
        className="search-btn" 
        id="searchBtn" 
        onClick={handleSearchClick}
      >
        🔍
      </button>
    </div>
  );
};
export default Searchlocation;