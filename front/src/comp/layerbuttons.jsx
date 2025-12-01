const Layerbuttons = ({ options, activeLayer, onLayerSelect }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '5px',
      margin: '10px 10px 0 10px',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,.3)',
    }}>
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onLayerSelect(option.key)}
          style={{
            backgroundColor: option.key === activeLayer ? '#4285F4' : 'white',
            color: option.key === activeLayer ? 'white' : '#333',
            border: '1px solid #ccc',
            padding: '8px 12px',
            margin: '2px 0',
            cursor: 'pointer',
            borderRadius: '3px',
            fontWeight: option.key === activeLayer ? 'bold' : 'normal',
            transition: 'background-color 0.2s',
          }}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default Layerbuttons;