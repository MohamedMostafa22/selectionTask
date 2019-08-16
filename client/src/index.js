import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import MapComponent from "./map_component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const Index = () => {
  const [date, setDate] = useState("");
  const [locations, setLocations] = useState();
  const [loading, setLoading] = useState(false);
  const [point, setPoint] = useState();

  // Request location data.
  useEffect(() => {
    fetch("http://localhost:3000")
      .then(response => response.json())
      .then(json => {
        setLocations(json);
      });
  }, []);

  const fetchPointByDate = date => {
    setLoading(true);
    fetch(`http://localhost:3000/location/${date}`)
      .then(res => res.json())
      .then(point => {
        setLoading(false);
        setPoint(point);
      });
  };

  let minDate = "";
  let maxDate = "";

  if (Array.isArray(locations)) {
    minDate =
      locations[locations.length - 1][
        locations[locations.length - 1].length - 1
      ].time;
    maxDate = locations[0][0].time;
  }

  return (
    <div>
      <div className="header">
        <h1>Welcome to the example task!</h1>
      </div>
      <DatePicker
        selected={date}
        onChange={date => {
          setDate(date);
          fetchPointByDate(date);
        }}
        showTimeSelect
        timeIntervals={15}
        minDate={minDate && new Date(minDate)}
        maxDate={maxDate && new Date(maxDate)}
        disabled={loading || !locations}
      />
      {loading && "Loading..."}
      <MapComponent locations={locations} point={point} />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("main-container"));
