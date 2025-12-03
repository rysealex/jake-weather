import { useRef, useEffect, useState } from 'react';
import '../index.css';

const Searchlocation = ({ map, onSelectLocation }) => {
  const inputRef = useRef(null);

  // useState hook for the current autocomplete instance
  const [autocomplete, setAutocomplete] = useState(null);

  // ref for the PlacesService to be initialized once
  const placesServiceRef = useRef(null);

  // useEffect to initialize the autocomplete and PlacesService on component mount
  // The Maps + Places library may load after this component mounts, so poll briefly
  useEffect(() => {
    let mounted = true;
    let pollTimer = null;
    let listener = null;

    const initWhenReady = () => {
      if (!mounted) return;

      if (!window.google || !window.google.maps || !window.google.maps.places) {
        return false;
      }

      // create autocomplete
      try {
        const newAutocomplete = new window.google.maps.places.Autocomplete(inputRef.current, { fields: ['geometry', 'name'] });
        setAutocomplete(newAutocomplete);

        // initialize PlacesService with the map when available; fall back to an off-DOM div
        try {
          placesServiceRef.current = new window.google.maps.places.PlacesService(map || document.createElement('div'));
        } catch (e) {
          console.error('[Searchlocation] Failed to create PlacesService:', e);
          placesServiceRef.current = null;
        }

        listener = newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          // clear search location search bar upon place change
          if (inputRef.current) inputRef.current.value = "";
          handlePlaceResult(place);
        });

        console.log('[Searchlocation] Autocomplete initialized');
        return true;
      } catch (e) {
        console.error('[Searchlocation] autocomplete init error:', e);
        return false;
      }
    };

    // First try immediate init
    if (!initWhenReady()) {
      // poll up to ~3 seconds for the library to load
      const start = Date.now();
      pollTimer = setInterval(() => {
        if (initWhenReady() || Date.now() - start > 3000) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      }, 200);
    }

    return () => {
      mounted = false;
      if (pollTimer) clearInterval(pollTimer);
      try {
        if (listener && typeof listener.remove === 'function') listener.remove();
      } catch (e) {}
      placesServiceRef.current = null;
    };
  }, [map]);

  // function to handle a successful place result
  const handlePlaceResult = (place) => {

    // remove selected and modal city from local storage
    localStorage.removeItem("selectedCity");
    localStorage.removeItem("modalCity");

    if (map && place.geometry && place.geometry.location) {
      // // center the map on the selected place
      // map.setCenter(place.geometry.location);
      // map.setZoom(15);
      // // update the input field with the place name
      // inputRef.current.value = place.name;
      // // notify parent about selected coordinates
      try {
        const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
        const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
        if (onSelectLocation) onSelectLocation(lat, lng);
      } catch (e) {}
    } else if (place.name) {
      console.log(`Place found: ${place.name}, but no geometry. Attempting geocode fallback.`);
      // fallback: use Geocoder to resolve the place name to coordinates
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: place.name }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK && results && results[0] && results[0].geometry && results[0].geometry.location) {
            const loc = results[0].geometry.location;
            // if (map) {
            //   map.setCenter(loc);
            //   map.setZoom(15);
            // }
            inputRef.current.value = place.name;
            // notify parent about selected coordinates
            try {
              const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
              const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
              if (onSelectLocation) onSelectLocation(lat, lng);
            } catch (e) {}
            console.log('[Searchlocation] Geocode fallback succeeded for', place.name, loc);
          } else {
            console.warn('[Searchlocation] Geocode fallback failed for', place.name, status);
          }
        });
      } else {
        console.warn('[Searchlocation] Geocoder not available to resolve', place.name);
      }
    } else {
      console.log("No details available for the selected place.");
    }
  };

  // function to handle the search button click
  const handleSearchClick = () => {
    const query = inputRef.current.value;
    if (!query || !placesServiceRef.current || !map) return;

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
    <div className="global-search" >
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