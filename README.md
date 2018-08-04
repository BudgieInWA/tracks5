# tracks

*TLDR,* this is a `react-create-app` app.

- `yarn start` - run in development mode
- `yarn test` - run tests

## Debugging

- React Devtools
- Redux Devtools

## Misc TODO

Game 

- Improve train movement
    - give them a movement plan that can be set and is used to make junction decisions during the movePhase
    - give them `targetSpeed` attr and accelerate/decelerate to it in the movePhase.
    - add pathfinding to set train movement plans
    
- Add buildings that trains can interact with
    - Station to collect/deliver goods
    - Home to stockpile resources
    - Something to generate resources

Engine
- only suggest valid track shapes in track tool. See ../tracks/
- right click and keyboard business
    - right click / esc - cancel / back
    - `\`` - debug console
- Look like unexplored map.
- find a transitiiiion-stable description of train positions so they can be css animated.
