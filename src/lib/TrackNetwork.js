import _ from "lodash";
import graphs from "@dagrejs/graphlib";

import { HexUtils } from "react-hexgrid";
// import Hex from './Hex';
import CardinalDirection from './CardinalDirection';
import TrackRail from './TrackRail';

export default class TrackNetwork {
  static between = {
    intersections: 'i',
    hexes: 'h',
  };

  static NotSimpleTrack = class extends Error {
    constructor(choices) {
      super('not-simple-track');
      this.choices = choices;
    }
  };

  constructor(state) {
    this.graph = state
      ? graphs.json.read(state)
      : new graphs.Graph({
        directed: false, // rail is rail.
        multigraph: true, // subdivide edges with tags/groups/type called "name"
      });
  }

  addPath(hexes) {
    const graph = this.graph;
    // if (!valid) {
    //   return/throw
    // }

    let prevHex;
    _.each(hexes, hex => {
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
        const forwardDir = CardinalDirection.of(HexUtils.subtract(hex, prevHex));
        graph.setEdge({ v: prevHex, w: hex, name: TrackNetwork.between.hexes }, {
          [prevHex]: { direction: forwardDir },
          [hex]: { direction: forwardDir.opposite },
        });
      }

      prevHex = hex;
    });

    // if (this.nodeEdges(prevHex).length === 1) {
    //
    // }
  }

  optionsFrom(node, direction=null) {
    const dir = CardinalDirection.of(direction);
    const outRails = _.map(this.nodeOutEdges(node, TrackNetwork.between.hexes), edge => this.rail(edge));
    if (dir) {
      return _.filter(outRails, ({direction}) => direction === dir || direction === dir.left || direction === dir.right);
    } else {
      return outRails;
    }
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
    _.each(this.nodeOutEdges(hex, TrackNetwork.between.hexes), e => {
      _.each(this.pathToIntersectionFollowingTrack(e), hex => {
        // Correct the 'between intersections' edge that this new intersection breaks.
        //TODO
      });
    });
  }

  connectedNodes(hex) {
    _.map(this.nodeOutEdges(hex, TrackNetwork.between.hexes), e => e.w);
  }

  /**
   * @param {string} from
   * @param {string} to
   * @returns {string[]}
   */
  shortestPath(from, to) {
    const distances = graphs.alg.dijkstra(this.graph, from, undefined, (v) => this.graph.nodeEdges(v));
    if (distances[to] === Number.POSITIVE_INFINITY) return null;

    const reversePath = [];
    let current = to;
    while (current !== from) {
      reversePath.push(current);
      current = distances[current].predecessor;
    }
    reversePath.push(from);
    return _.reverse(reversePath);
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
    const destinationOutEdges = _.filter(this.nodeOutEdges(edge.w, TrackNetwork.between.hexes), e => e.w === edge.v);
    if (destinationOutEdges.length !== 1) throw new TrackNetwork.NotSimpleTrack({choices: destinationOutEdges});
    return destinationOutEdges[0];
  }

  nodeEdges(node, name) {
    return _.filter(this.graph.nodeEdges(node), { name });
  }

  /**
   * @param {string} edge.v
   * @param {string} edge.w
   * @returns {TrackRail|undefined}
   */
  rail(edge) {
    const edgeObj = { v: edge.v, w: edge.w, name: TrackNetwork.between.hexes };
    const edgeData = this.graph.edge(edgeObj);
    if (!edgeData) return undefined;
    return new TrackRail(edge, edgeData);
  }

  /**
   * @returns {TrackRail[]}
   */
  rails() {
    const edges = this.graph.edges();
    return _.map(edges, e => new TrackRail(e, this.graph.edge(e)));
  }

  /** All edges from node with v === node */
  nodeOutEdges(hex, name) {
    const node = hex.toString();
    return _.map(this.nodeEdges(node, name), edge => edge.w === node ? {...edge, v: edge.w, w: edge.v} : edge);
  }
}

