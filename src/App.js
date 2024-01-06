// App.js
import React, { useState } from 'react';
import ElevatorCar from './components/ElevatorCar';
import ElevatorForm from './components/ElevatorForm';
import ElevatorModel from './components/ElevatorModel';
import Header from './components/Header';
import RestartButton from './components/RestartButton';
import CarDisplay from './components/CarDisplay';
import './App.css';

function App() {
  const [elevatorInstance, setElevatorInstance] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const createElevator = (totalFloors, currFloor, dockRequests) => {
    return new ElevatorCar({
      totalFloors,
      currFloor,
      dockRequests,
      emergencyStop: false,
      fireMode: false,
      doorStuck: false,
      maxWeight: 2500,
      currWeight: 0,
      travelTime: 0,
      floorsStoppedAt: [],
      direction: null,
      motion: 'awaiting',
      doorOpen: true,
      upRequests: [],
      downRequests: [],
      logDone: false,
      nap: false,
    });
  };

  const handleFormSubmit = (formData) => {
    const newElevatorInstance = createElevator(formData.totalFloors, formData.currFloor, formData.dockRequests);
    setElevatorInstance(newElevatorInstance);
    newElevatorInstance.wakeUpElevator();
    setFormSubmitted(true);
  };



  return (
    <div>
      <RestartButton />
      <div className="app-container">
        <Header />
        <div className="centered-container">
          {!formSubmitted && <ElevatorForm onSubmit={handleFormSubmit}/>}
          {formSubmitted && (
            <div className="columns-container">
              <div className="column">
                {/* This is the left column, reserve for the third component */}
                {/* You can add your third component here in the future */}
              </div>
              <div className="column">
                {/* This is the center column, displaying ElevatorModel */}
                <ElevatorModel elevatorInstance={elevatorInstance} />
              </div>
              <div className="column">
                {/* This is the right column, displaying CarDisplay */}
                <CarDisplay elevatorInstance={elevatorInstance} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;