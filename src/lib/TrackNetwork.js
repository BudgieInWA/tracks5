import _ from "lodash";
import graphs from "@dagrejs/graphlib";

import { Hex, HexUtils } from "react-hexgrid";
import CardinalDirection from '../lib/CardinalDirection';

const makeHex = (str) => str ? new Hex(...(str.split(',').map(s => parseInt(s)))) : str;

export default class TrackNetwork {
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
        graph.setEdge({ v: prevHex, w: hex, name: TrackNetwork.between.hex }, { direction: HexUtils.subtract(hex, prevHex) });
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
    _.each(this.nodeOutEdges(hex, TrackNetwork.between.hex), ([e, v]) => {
      _.each(this.pathToIntersectionFollowingTrack(e), hex => {
        // Correct the 'between intersections' edge that this new intersection breaks.
        //TODO
      });
    });
  }

  connectedNeighbors(hex) {
    _.map(this.nodeOutEdges(hex, TrackNetwork.between.hex), ([e, v]) => e.w);
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
    const destinationOutEdges = _.filter(this.nodeOutEdges(edge.w, TrackNetwork.between.hex), ([e, v]) => e.w === edge.v);
    if (destinationOutEdges.length !== 1) throw new TrackNetwork.NotSimpleTrack({choices: destinationOutEdges});
    return destinationOutEdges[0];
  }

  nodeEdges(node, name) {
    return _(this.graph.nodeEdges(node))
      .filter({ name })
      .map(edge => [edge, this.graph.edge(edge)])
      .value();
  }
  /** All edges from node with v === node */
  nodeOutEdges(hex, name) {
    const node = hex.toString();
    return _.map(this.nodeEdges(node, name), ([edge, data]) => (
      edge.w === node
        ? [{...edge, v: edge.w, w: edge.v}, {...data, direction: CardinalDirection.reverse(data.direction)}]
        : [edge, data]
    ));
  }
  static otherEndOf = (edge, hex) => hex !== edge.w ? edge.w : edge.v;
}

