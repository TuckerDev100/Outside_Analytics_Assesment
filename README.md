===========================================================

# The assignment

Provide code that simulates an elevator. You are free to use any language.
Upload the completed project to GitHub for discussion during interview.
Document all assumptions and any features that weren’t implemented.
The result should be an executable, or script, that can be run with the following inputs and generate the following outputs.
Inputs: [list of floors to visit] (e.g. elevator start=12 floor=2,9,1,32)
Outputs: [total travel time, floors visited in order] (e.g. 560 12,2,9,1,32)
Program Constants:
Single floor travel time: 10

### If cloning from GitHub

1. Open a terminal.
2. Run the command `git clone https://github.com/TuckerDev100/Outside_Analytics_Assesment.git`.
3. If you don't have npm, please go to https://nodejs.org/ and install Node.js and npm.
4. In the terminal, navigate to the project directory.
5. Run `npm install` to install all dependencies.
6. Run `npm start`.
7. It should open a webpage on localhost:3000.

# How to use the App
go to
https://master.d1oh7hlyihrrmi.amplifyapp.com/
Enter the input information
Submit

## ASSUMPTIONS: **\***

This is the only elevator for the building.

Whether a user wants to go up or down, if the elevator stops at their floor they will get on/off regardless of the intentions of the elevator.

It takes 10 seconds to go from one floor to another. I assume this means onloading a passenger, going to the next floor, and then offloading the passenger.
From this I take it to mean that it takes 5 seconds to dock at one floor. I decided to add one second to the timer if a floor is not docked at. 

---

## Why did I optimize it this this way?

Given that there is one elevator, there are two possible ways to optimize it:

### Optimize for minimizing wait time :

1: Go to the nearest floor with a passenger waiting
2: Take them to their destination, picking up any passengers going in the same direction

### Optimize for every passenger being served in a reasonable timeframe:

1: Go all the way to the top, then all the way to the bottom
2: Start going all the way to the top. If there are no more requests above, start going down.

I went with option two. Here's why:
Let's say that there is that floors 1-3 are very popular. As soon as the elevator gets services floor 3,
there is almost always another request on floor 2 or 1. This can keep going indefinetly.
If there are no requests on floors 4-9, but there is someone on floor 10 who wants to go down,
that person may be waiting a long time.
This is unnacceptable because elevators are not a lazy alternative to the stairs,
they are an important piece of infrastrucre to make building handicap accessible.
Sure with the second option someone wanting to go up may have to first go down and will have to wait longer,
but that is an acceptable trade off. Just like how in parking lots there are almost always more handicap spots
than are neccessary, serving everyone takes priority over maximum efficiency.

# What did I do well?
The elevator will go in the direction that has the most requests. If there are an equal number of requests, it will pick the direction with the closest floor. If both directions have floors that are equally close, it will default to down.

It listens for live input. It will not change direction if there are still requests in that direction, but it will put the requests in order and service them in turn. After it is done, it will go to the bottom floor and wait. It will begin again once it gets new requests.

I also mocked up features that are beyond the scope of the assignment, but any reasonalbe elevator should have, like a fire mode, a check if the door has successfully closed, and an emergency stop.
I took the assignment to be *simulate* an Elevator, not write an elevator algorithm to get certain outputs. I think my
elevator is well thought out.


# What can I improve on?
Tests! During rev 1 of the elevator, I wrote tests for most of the functions in ElevatorCar. However, I did a major refactor to make it visually render it and make it take live input from the user. Most of my previous tests no longer work. In a production environment, I would need to have all behaviors tested before deploying.

Tests are SUPER important. They are like saving your game in a video game. Without tests, you don't know if new changes have undone all of your progress. However, I think this highlights the proper place of tests: they should be written after you get the behavior you want. Write tests too early, and you will have to re-write your tests. Write tests too late, and you are never coming back to it and the next time the code is changed it is likely to break.

It is quite ugly. I am not a designer. Not to say that I cannot design, that just means there is more of a learning curve. Also, a real elevator would not even have a UI, save the buttons, so I felt comfortable de-prioritizing making it look nice.

# Next steps

Normal actions of the elevator should be interruptable in the event of a safety condition. This includes someone hitting an emergency stop button,
the elevator being over weight, the door failing to shut, or a firefighter inserting a key into the the fire keyhole. 

After the elevator has rested, it should log the info on how many floors it serviced and how long it took to a log file. This could produce useful insights on how the elevator is used.

I could add support for screen readers to the app.

I can make the app look nicer. Maybe have an Elevator sprite instead of an X, and I could animate the door opening and closing. I could also stream some elevator music.