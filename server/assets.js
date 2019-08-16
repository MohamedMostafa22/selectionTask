const getDate = date => new Date(date);

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
        if (getDate(lastTime) - getDate(point.time) >= INTERVAL) {
          trips.push(trackingHistory.slice(lastIndex, index));
          lastIndex = index;
        }
        lastTime = point.time;
      }
    });
    trips.push(trackingHistory.slice(lastIndex));
    return trips;
  }
  return trackingHistory;
};

//Used binary search since the locations array is already sorted
exports.getPointByDate = (trackingHistory, when) => {
  const dateValue = getDate(when);
  let min = 0;
  let max = trackingHistory.length - 1;
  let guess;
  while (min < max) {
    guess = Math.floor((min + max) / 2);
    const dateBefore = getDate(trackingHistory[min].time);
    const dateExact = getDate(trackingHistory[guess].time);
    const dateAfter = getDate(trackingHistory[max].time);
    if (dateExact === dateValue) return trackingHistory[guess];
    else if (
      Math.abs(dateBefore - dateValue) > Math.abs(dateAfter - dateValue)
    ) {
      min = guess + 1;
    } else {
      max = guess - 1;
    }
  }
  return trackingHistory[guess];
};
