// CarDisplay.js
import React, { useEffect, useState } from 'react';
import './CarDisplay.css'

const CarDisplay = ({ elevatorInstance }) => {
  const [floorsStoppedAt, setFloorsStoppedAt] = useState([]);
  const [travelTime, setTravelTime] = useState(0);
  const [currFloor, setCurrFloor] = useState(0); // Add state for current floor
  const [dockRequests, setDockRequests] = useState([]); // Add state for current floor


  useEffect(() => {
    const updateDisplay = () => {
      setFloorsStoppedAt([...elevatorInstance.floorsStoppedAt]);
      setTravelTime(elevatorInstance.travelTime);
      setCurrFloor(elevatorInstance.currFloor);
      setDockRequests([...elevatorInstance.dockRequests]);

    };

    updateDisplay();

    const intervalId = setInterval(updateDisplay, 500);
    return () => clearInterval(intervalId);
  }, [elevatorInstance]);

  return (
    <div>
        <h2>Car Display</h2>

      <div className="car-display-container">
        <div className ="car-display-scrollable">

        <div className="car-display">
        <p>Current Floor: {currFloor}</p>
          <p>Floors Stopped At: {floorsStoppedAt.join(', ')}</p>
          <p>Travel Time: {travelTime} seconds</p>
          <p>Dock Requests: {dockRequests.join(', ')} </p>
        </div>

        </div>
      </div>
    </div>
     
  );
};

export default CarDisplay;
