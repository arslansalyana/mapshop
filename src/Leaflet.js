import React, { useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw';

const ShapeLayer = ({ setShapes }) => {
  const onShapeCreated = (layer) => {
    const coords = layer.getLatLngs().map((latlng) => [latlng.lat, latlng.lng]);
    const shape = layer instanceof L.Polygon ? 'polygon' : 'polyline';
    if ((shape === 'polygon' && coords.length >= 3) ||
        (shape === 'polyline' && coords.length >= 2) ||
        (shape === 'rectangle' && coords.length === 4)) {
      setShapes((shapes) => [...shapes, { shape, coords }]);
    }
  };

  useMapEvents({
    created: (e) => {
      onShapeCreated(e.layer);
    },
    edited: (e) => {
      e.layers.eachLayer((layer) => {
        onShapeCreated(layer);
      });
    },
  });
  return null;
};

const Leaflet = () => {
  const [shapes, setShapes] = useState([]);

  const onCreated = (e) => {
    const shape = e.layer.toGeoJSON();
    setShapes((shapes) => [...shapes, shape]);
    console.log(shapes);
  };

  const options = {
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: false,
      circlemarker: false,
      marker: false,
    },
  };

  return (
    <MapContainer center={[33.68, 73.04]} zoom={11} style={{ height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup>
        <EditControl position="topright" onCreated={onCreated} draw={options.draw} />
      </FeatureGroup>
      <ShapeLayer setShapes={setShapes} />
    </MapContainer>
  );
};

export default Leaflet;