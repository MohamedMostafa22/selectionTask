/* global fetch, L */
import React, { useEffect, useRef, useState } from "react";
import Moment from "moment";

const getRouteSummary = locations => {
  const to = Moment(locations[0].time).format("hh:mm DD.MM");
  const from = Moment(locations[locations.length - 1].time).format(
    "hh:mm DD.MM"
  );
  return `${from} - ${to}`;
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MapComponent = ({ locations, point }) => {
  const map = useRef();

  // Initialize map.
  useEffect(() => {
    map.current = new L.Map("mapid");
    const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution =
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution
    });
    map.current.setView(new L.LatLng(52.51, 13.4), 9);
    map.current.addLayer(osm);
  }, []);

  // Update location data on map.
  useEffect(() => {
    if (!map.current || !locations) {
      return; // If map or locations not loaded yet.
    }
    const polylines = [];
    Array.isArray(locations) &&
      locations.forEach(trip => {
        polylines.push(
          L.polyline(trip, { color: getRandomColor() })
            .bindPopup(getRouteSummary(trip))
            .addTo(map.current)
        );
      });
    polylines.forEach(line => map.current.fitBounds(line.getBounds()));
    return () => polylines.forEach(line => map.current.remove(line));
  }, [locations, map.current]);

  useEffect(() => {
    if (!map.current || !locations || !point) return;
    const marker = new L.marker([point.lat, point.lon]);
    marker.addTo(map.current);
    return () => map.current.removeLayer(marker);
  });

  return (
    <div>
      {locations && `${locations.length} locations loaded`}
      {!locations && "Loading..."}
      <div id="mapid" />
    </div>
  );
};

export default MapComponent;
