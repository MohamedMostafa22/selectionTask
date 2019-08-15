exports.splitIntoTrips = trackingHistory => {
  // 2 hours worth of milliseconds
  const INTERVAL = "7200000";
  if (Array.isArray(trackingHistory)) {
    const trips = [];
    let lastTime = trackingHistory[0] && trackingHistory[0].time;
    //Index to start slicing from
    let lastIndex = 0;
    trackingHistory.forEach((point, index) => {
      if (point.time) {
        if (new Date(lastTime) - new Date(point.time) >= INTERVAL) {
          trips.push(trackingHistory.slice(lastIndex, index));
          lastIndex = index;
        }
        lastTime = point.time;
      }
    });
    return trips;
  }
  return trackingHistory;
};
