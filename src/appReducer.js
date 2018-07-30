import _ from 'lodash';
import { combineReducers } from 'redux';
import graphs from '@dagrejs/graphlib';

import { Hex } from 'react-hexgrid';

import ActionTypes from './ActionTypes';

const toolName = (state = 'line', action) => action.type === ActionTypes.toolName ? action.toolName : state;


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
        graph.setEdge({ v: prevHex, w: hex, name: this.between.hex }, /* directions, ... */);
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
    _.each(this.nodeOutEdges(hex, this.between.hex), e => {
      _.each(this.pathToIntersectionFollowingTrack(e), hex => {
        // Correct the 'between intersections' edge that this new intersection breaks.
        //TODO
      });
    });
  }

  connectedNeighbors(hex) {
    _.map(this.nodeOutEdges(hex, this.between.hex), 'w');
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

function path(state = [], action) {
  switch(action.type) {
    case ActionTypes.path.start:  return [action.hex, action.hex];
    case ActionTypes.path.end: return state.length === 0 ? [] : [state[0], action.hex];
    case ActionTypes.path.clear:  return [];
    default: return state;
  }
}

const buildings = () => [{hex: Hex.origin, name: 'test building'}];

const terrain = () => ({ [Hex.origin]: { type: 'grass', color: 'green' } });


export default combineReducers({ toolName, buildings, path, terrain, tracks })
