import React, { useEffect, useState } from 'react';
import './ElevatorSelect.css';
import eventEmitter from './eventEmitter';

const ElevatorSelect = ({ elevatorInstance, updateElevatorCar }) => {
  const { totalFloors, dockRequests } = elevatorInstance;
  const [floorsData, setFloorsData] = useState([]);

  const generateFloorsData = () => {
    const newFloorsData = Array.from({ length: totalFloors }, (_, index) => {
      const floorNumber = totalFloors - index;
      const isInDockRequests = dockRequests.includes(floorNumber);
      return { floorNumber, isInDockRequests };
    });
    setFloorsData(newFloorsData);
  };

  const handleFloorClick = (floorNumber) => {
    if (!dockRequests.includes(floorNumber)) {
      dockRequests.push(floorNumber);
      eventEmitter.emit('updateDockRequests');
    }
  };
  

  useEffect(() => {
    const updateDockRequests = () => {
      generateFloorsData();
    };
    eventEmitter.on('updateDockRequests', updateDockRequests);

    return () => {
      eventEmitter.off('updateDockRequests', updateDockRequests);
    };
  }, [dockRequests]);

  useEffect(() => {
    generateFloorsData();
  }, [totalFloors, dockRequests]);

  return (
    <div>
      <h2>Elevator Select</h2>
      <div className="elevator-select-container elevator-select-scrollable">
        {floorsData.map((floorData) => (
          <div
            key={floorData.floorNumber}
            onClick={() => handleFloorClick(floorData.floorNumber)}
            className={`floor-circle ${floorData.isInDockRequests ? 'yellow' : 'white'}`}
          >
            {floorData.floorNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElevatorSelect;
