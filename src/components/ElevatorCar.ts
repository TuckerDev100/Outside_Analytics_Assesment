import { Direction } from "src/enums/Direction";
import eventEmitter from './eventEmitter';
export interface ElevatorState {
  emergencyStop: boolean;
  fireMode: boolean;
  doorStuck: boolean;
  maxWeight: number;
  currWeight: number;
  travelTime: number;
  floorsStoppedAt: number[];
  totalFloors: number;
  direction: Direction;
  currFloor: number;
  nextFloor: number;
  doorOpen: boolean;
  dockRequests: number[];
  logDone: boolean;
  nap: boolean;

  waitDuration: number;
}

export default class ElevatorCar {

  travelTime!: number;
  floorsStoppedAt!: number[];

  totalFloors!: number;
  currFloor!: number;
  nextFloor!: number;
  dockRequests!: number[];

  direction: Direction = Direction.None;
  
  doorOpen!: boolean;

  logDone!: boolean;
  nap!: boolean;

  emergencyStop!: boolean;
  fireMode!: boolean;
  doorStuck!: boolean;
  maxWeight!: number;
  currWeight!: number;
  waitDuration!: number;



  constructor(state: ElevatorState) {
    this.updateState({
      emergencyStop: state.emergencyStop,
      fireMode: state.fireMode,
      doorStuck: state.doorStuck,
      maxWeight: state.maxWeight,
      currWeight: state.currWeight,
      travelTime: state.travelTime,
      floorsStoppedAt: state.floorsStoppedAt,
      totalFloors: state.totalFloors,
      direction: state.direction,
      currFloor: state.currFloor,
      nextFloor: state.nextFloor,
      doorOpen: state.doorOpen,
      dockRequests: state.dockRequests || [],
      logDone: state.logDone,
      nap: state.nap,
    });
  }

  updateState(newState: Partial<ElevatorState>): void {
    Object.assign(this, newState);
  }

  public logState(): void {
    const elevatorState: ElevatorState = {
      emergencyStop: this.emergencyStop,
      fireMode: this.fireMode,
      doorStuck: this.doorStuck,
      maxWeight: this.maxWeight,
      currWeight: this.currWeight,
      travelTime: this.travelTime,
      floorsStoppedAt: this.floorsStoppedAt,
      totalFloors: this.totalFloors,
      direction: this.direction,
      currFloor: this.currFloor,
      nextFloor: this.nextFloor,
      doorOpen: this.doorOpen,
      dockRequests: this.dockRequests,
      logDone: this.logDone,
      waitDuration: this.waitDuration,
      nap: this.nap,
    };

    console.log("Elevator State:", elevatorState);
  }


  async wakeUpElevator(): Promise<void | null> {
    if (!this.safetyCheck()) {
      return null;
    }

    console.log('wakeup called')

    this.removeRequestsEqualToCurrFloor();
     this.setInitialDirection();
  }

  public setInitialDirection(): void {
    const aboveRequests = this.dockRequests.filter((floor) => floor > this.currFloor);
    const belowRequests = this.dockRequests.filter((floor) => floor < this.currFloor);
  
    if (aboveRequests.length > belowRequests.length) {
      this.direction = Direction.Up;
    } else if (aboveRequests.length < belowRequests.length) {
      this.direction = Direction.Down;
    } else {
      const closestAbove = Math.min(...aboveRequests, this.totalFloors);
      const closestBelow = Math.max(...belowRequests, 1);
    
      // Factor in the position of currFloor
      const aboveDistance = Math.abs(closestAbove - this.currFloor);
      const belowDistance = Math.abs(closestBelow - this.currFloor);
    
      this.direction = aboveDistance < belowDistance ? Direction.Up : Direction.Down;
    }
    this.controlLoop();
  }


  removeRequestsEqualToCurrFloor(): void {
    this.dockRequests = this.dockRequests.filter(
      (floor) => floor !== this.currFloor
    );
  }

  routeCheck(): void {
    switch (true) {
      case this.currFloor === this.totalFloors:
        this.direction = Direction.Down;
        break;
      
      case this.currFloor === 1:
        this.direction = this.dockRequests.length > 0 ? Direction.Up : Direction.None;
        break;
  
      case this.dockRequests.length > 0:
        switch (this.direction) {
          case Direction.Up:
            if (this.dockRequests.some((floor) => floor > this.currFloor)) {
              this.direction = Direction.Up;
            } else if (this.dockRequests.some((floor) => floor < this.currFloor) && !this.dockRequests.some((floor) => floor > this.currFloor)) {
              this.direction = Direction.Down;
            }
            break;
  
          case Direction.Down:
            if (this.dockRequests.some((floor) => floor < this.currFloor)) {
              this.direction = Direction.Down;
            } else if (this.dockRequests.some((floor) => floor > this.currFloor) && !this.dockRequests.some((floor) => floor < this.currFloor)) {
              this.direction = Direction.Up;
            }
            break;
  
          default:
            break;
        }
        break;
  
      default:
        this.direction = this.currFloor > 1 ? Direction.Down : Direction.None;
        break;
    }
  }
  
  
  
  
  



  moveFloor(floor: number): void {

    console.log(`Processing floor ${floor}`);

    let isDocking = false;

    if(this.dockRequests.includes(this.currFloor)){
      isDocking = true;
    }
    this.waitDuration = isDocking ? 5 : 1;
    this.travelTime += this.waitDuration;

  
    if (isDocking) {

      console.log(`Docking at floor ${floor}`);

      this.floorsStoppedAt.push(floor);
      this.removeRequestsEqualToCurrFloor();
      this.dock();
    }
  }
  

  private async controlLoop(): Promise<void> {
    this.waitDuration = 1;
    this.nap = false;
    const updateDockRequestsHandler = () => {
      this.dockRequests = this.dockRequests.slice();
    };
  
    eventEmitter.on('updateDockRequests', updateDockRequestsHandler);
  
    while (this.direction !== Direction.None) {
      this.moveFloor(this.currFloor);
      await this.delay(this.waitDuration);
      console.log(`Waited for ${this.waitDuration} seconds`);
      eventEmitter.emit('updateDockRequests');
      eventEmitter.emit('updateElevatorModel');
      this.routeCheck();
      console.log(`${this.direction}`);
  
      if (this.direction === Direction.Up) {
        this.currFloor += 1;
      } else if (this.direction === Direction.Down) {
        this.currFloor -= 1;
      }
    }
  
    eventEmitter.off('updateDockRequests', updateDockRequestsHandler);
    this.rest();
  }
  


  private rest(): void {
    console.log("Resting...");
  
    const updateDockRequestsHandler = () => {
      console.log("Received updateDockRequests during rest. Waking up elevator.");
      this.wakeUpElevator();
  
      eventEmitter.off('updateDockRequests', updateDockRequestsHandler);
    };
  
    eventEmitter.on('updateDockRequests', updateDockRequestsHandler);
  }


private async delay(seconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}




  safetyCheck(): boolean {
    //NOTE ideally this should run asynchronously constantly and interrupt all other elevator functions at a moment's notice
    if (this.emergencyStop) {
      this.invokeEmergencyStop();
      return false;
    }

    if (this.fireMode) {
      this.fireStop();
      return false;
    }

    if (this.doorStuck) {
      this.doorCheck();
      return false;
    } else {
      return true;
    }
  }

  dock(): void {
    //NOTE - This is a little silly as is. Ideally, you would have a system or switch that would physically verify that the elevator has stopped,
    // another one to verify that the door has opened successfully, and another one to verify that the door has closed successfully before
    // moving the elevator. This is because it is VERY IMPORTANT to make sure the elevator doors are fully closed before moving it
    //TODO add a stop elevator method
    //TODO add a door opening method
    //TODO add a weight check method
    //TODO add a door closing method. if a person or thing blocks the elevator door, it should stop. 
    // This is the diff between putting your hand in the door being a friendly gesture hold the elevator and cutting your hand off.
  }

  invokeEmergencyStop(): void {
    //NOTE - if someone hits the emergecy stop, the elevator should ignore all request logic and immediately stop the elevator at the nearest floor.
    //TODO -  Implement emergency stop
  }

  fireStop(): void {
    //NOTE - If the fire key is inserted, the elevator should ignore all other requests and go to the floor the fireman has requested
    //TODO -  Implement fire stop
  }

  weightStop(): void {
    //NOTE - if the weight is exceeded, if the elevator is stopped it should stay stopped and activate an alarm notification until the weight is acceptable
    //TODO -  Implement weight stop
  }

  doorCheck(): void {
    //NOTE - The door closing should be an operation. If the door begins to close but runs into something, it should reverse course.
    // if this happens a certain number of times it should activate an alarm
    //TODO -  Implement door check
  }
}
