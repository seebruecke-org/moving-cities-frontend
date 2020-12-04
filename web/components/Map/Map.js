import ReactMapboxGl from 'react-mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import * as styles from './map.styles';

const Map = () => {
  const MapboxMap = ReactMapboxGl({
    accessToken:
      'pk.eyJ1IjoiZ3VzdGF2cHVyc2NoZSIsImEiOiJhVVRUaFV3In0.IdUObuDS1u0tzNNDvNpfKg'
  });

  return <MapboxMap style="mapbox://styles/mapbox/streets-v9" containerStyle={styles.container} />;
}

export default Map;