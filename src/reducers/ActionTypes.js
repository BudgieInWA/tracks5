export default {
  terrain: {
    reveal: 'REAVEAL_TERRAIN',
  },

  buildings: {
    build: 'BUILD_BUILDING',
  },

  tracks: {
    build: 'TRACKS_BUILD',
  },

  trains: { // TODO move some into `train`
    add: 'trains.build',
    name: 'trains.name',
    targets: 'trains.targets',
    schedule: 'trains.schedule',
  },

  train: {
    path: 'train.path',
    goto: 'train.goto',
  },

  inventories: {
    limit: 'inventories.limit',
    transfer: 'inventories.transfer',
  },

  game: {
    movePhase: 'game.movePhase',
    transferPhase: 'game.transferPhase',
    explorePhase: 'game.explorePhase',
    turnResolve: 'game.turnResolve',

    buildTrain: 'game.buildTrain',
  },

  tool: {
    name: 'tool',
    option: 'option',
    poke: 'poke',
    hexes: {
      start: 'PATH_START',
      end:  'PATH_END',
      clear: 'PATH_CLEAR',
    },
  },

  view: {
    pan: 'pan',
    zoomIn: 'zoom_in',
    zoomOut: 'zoom_out',
  },

  inputs: {
    on: 'inputs.on',
    off: 'inputs.off',
    stateAction: 'inputs.action',
  },
};