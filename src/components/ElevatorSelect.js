import React, { useEffect, useState } from 'react';
import './ElevatorSelect.css';
import eventEmitter from './eventEmitter';

const ElevatorSelect = ({ elevatorInstance }) => {
  const { totalFloors, dockRequests } = elevatorInstance; //props passed in for initial render
  const [floorsData, setFloorsData] = useState([]); // local state used to update selected floors.

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

  useEffect(() => { //runs on initial render
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
