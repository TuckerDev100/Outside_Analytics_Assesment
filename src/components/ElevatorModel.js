import React, { useEffect, useState } from 'react';
import './ElevatorModel.css';
import eventEmitter from './eventEmitter';

const ElevatorModel = ({ elevatorInstance }) => {
  const { totalFloors, currFloor } = elevatorInstance;
  const [floors, setFloors] = useState([]);

  const generateFloors = () => {
    const newFloors = Array.from({ length: totalFloors }, (_, index) => {
      const isElevatorFloor = index === totalFloors - currFloor;
      const reversedIndex = (totalFloors - index) ;
      return { floorNumber: reversedIndex, isElevatorFloor };
    });
    setFloors(newFloors);
  };
  

  useEffect(() => {
    const updateElevatorModel = () => {
      generateFloors();
    };
    eventEmitter.on('updateElevatorModel', updateElevatorModel);

    return () => {
      eventEmitter.off('updateElevatorModel', updateElevatorModel);
    };
  }, [currFloor]);

  useEffect(() => {
    generateFloors();
  }, [totalFloors, currFloor]);

  return (
    <div>
        <h2>Elevator Model</h2>
        <div className="elevator-model-container">
            <div className="elevator-model-scrollable">
                <div className="elevator-model">
                    {floors.map((floor) => (
                        <div key={floor.floorNumber} className="floor">
                            <span className="floor-number">{floor.floorNumber}</span>
                            <span style={{ whiteSpace: 'pre' }}>{floor.isElevatorFloor ? '| X |' : '|   |'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
};

export default ElevatorModel;
