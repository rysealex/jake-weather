import '../index.css';

const Layerbuttons = ({ options, activeLayer, onLayerSelect }) => {
  return (
    <div className='map-buttons'>
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
          {option.icon}
        </button>
      ))}
    </div>
  );
};

export default Layerbuttons;