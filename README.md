# tracks

*TLDR,* this is a `react-create-app` app.

- `yarn start` - run in development mode
- `yarn test` - run tests
- `yarn build` - build

## Debugging

- React Devtools
- Redux Devtools

## Misc TODO

Game 

- Improve train movement
    - add pathfinding to set train movement plans
    - Trains see and reveal in a radius
    
- add Stores with trading 
    - maybe a store has offers, and if two stores nearby have opposing offers, the trade can happen.
    
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
