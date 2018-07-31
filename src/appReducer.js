import _ from 'lodash';
import { combineReducers } from 'redux';
import graphs from '@dagrejs/graphlib';

import { Hex, HexUtils } from 'react-hexgrid';

import ActionTypes from './ActionTypes';


class TrackNetwork {
  constructor(state) {
    this.graph = state
      ? graphs.json.read(state)
      : new graphs.Graph({
        directed: false, // rail is rail.
        multigraph: true, // subdivide edges with tags/groups/type called "name"
      });
  }

  static between = {
    turn: 't',
    intersection: 'i',
    hex: 'h',
  };

  static NotSimpleTrack = class extends Error {
    constructor(choices) {
      super('not-simple-track');
      this.choices = choices;
    }
  };

  addPath(hexes) {
    const graph = this.graph;
    // if (!valid) {
    //   return/throw
    // }

    let prevHex;
    let prevJoinedIntersection;
    _.each(hexes, hex => {
      prevJoinedIntersection = false;
      if (this.graph.hasNode(hex)) {
        // if (isIntersection(hex)) {
          // Join the intersection.
          // prevJoinedIntersection = true;

          // Finish off all the pending 'to intersection' edges.

          // ...
        // } else {
          // break up the section, ...
        // }
      }

      if (prevHex) {
        // Fill in the "between hex" network.
        graph.setEdge({ v: prevHex, w: hex, name: TrackNetwork.between.hex }, /* directions, ... */);
      }

      prevHex = hex;
    });

    // if (this.nodeEdges(prevHex).length === 1) {
    //
    // }
  }

  state() {
    return graphs.json.write(this.graph);
  }

  /**
   * Marks a hex as an intersection in the "between intersections" network.
   *
   * It does this by flood filling to the next intersection.
   *
   * @param {Hex} hex
   */
  markIntersection(hex) {
    _.each(this.nodeOutEdges(hex, TrackNetwork.between.hex), e => {
      _.each(this.pathToIntersectionFollowingTrack(e), hex => {
        // Correct the 'between intersections' edge that this new intersection breaks.
        //TODO
      });
    });
  }

  connectedNeighbors(hex) {
    _.map(this.nodeOutEdges(hex, TrackNetwork.between.hex), 'w');
  }

  pathToIntersectionFollowingTrack(edge, path=[]) {
    if (path.length === 0) {
      path.push(edge.v);
    }

    path.push(edge.w);

    try {
      return this.pathToIntersectionFollowingTrack(this.nextEdgeFollowingTrack(edge), path);
    } catch (error) {
      if (error instanceof TrackNetwork.NotSimpleTrack) {
        // w is an intersection, we have reached the end of the path.
        return path;
      } else {
        throw error;
      }
    }
  }

  nextEdgeFollowingTrack(edge) {
    const destinationOutEdges = _.filter(this.nodeOutEdges(edge.w), { w: edge.v });
    if (destinationOutEdges.length !== 1) throw new TrackNetwork.NotSimpleTrack({choices: destinationOutEdges});
    return destinationOutEdges[0];
  }

  nodeEdges = (node, name) => _.filter(this.graph.nodeEdges(node), { name });
  /** All edges from node with v === node */
  nodeOutEdges = (node, name) => _.map(this.nodeEdges(node, name), e => e.w === node ? {...e, v: e.w, w: e.v} : e);
  static otherEndOf = (edge, hex) => hex !== edge.w ? edge.w : edge.v;
}

function tracks(state, action) {
  if (!state) return new TrackNetwork().state();
  if (!_.includes(ActionTypes.tracks, action.type)) return state;

  const network = new TrackNetwork(state);

  switch(action.type) {
    case ActionTypes.tracks.build:
      network.addPath(action.hexes);
      break;

    default:
      return state;
  }

  return network.state();
}


const name = (state = 'poke', action) => action.type === ActionTypes.tool.name ? action.name : state;


function hexesCrossedByLine(start, end) {
  const distance = HexUtils.distance(start, end);
  if (distance === 0) return [end];
  if (distance === 1) return [start, end];

  const intersects = [];
  let step = 1.0 / Math.max(distance, 1);
  for (let i=0; i<=distance; i++) {
    intersects.push(HexUtils.round(HexUtils.hexLerp(start, end, step * i)));
  }
  return intersects;
}

function hexes(state = [], action) {
  switch(action.type) {
    case ActionTypes.tool.hexes.start:
      return [action.hex];

    case ActionTypes.tool.hexes.end:
      if (action.hex === state[0]) return state;
      if (state.length === 0) return state;

      // "Unravel" the path if it is being traced backwards.
      if (state.length > 1 && HexUtils.equals(state[state.length - 2], action.hex)) {
        return [...state.slice(0, -1)];
      }

      // Add the chain of hexes between the end and the new hex.
      return [...state, ...hexesCrossedByLine(state[state.length - 1], action.hex).slice(1)];

    case ActionTypes.tool.hexes.clear:
    case ActionTypes.tool.name:
      return [];

    default:
      return state;
  }
}

const tool = combineReducers({ name, hexes });

const buildings = () => [{hex: Hex.origin, name: 'test building'}];

const terrain = () => ({ [Hex.origin]: { type: 'grass', color: 'green' } });

const trains = () => [];


export default combineReducers({ tool, terrain, tracks, buildings, trains })
