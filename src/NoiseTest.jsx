import _ from "lodash";
import React from "react";
import { Noise } from 'noisejs';

console.log({Noise})
const noise = new Noise(420);

export default class NoiseTest extends React.PureComponent {
  drawNoise(canvas) {
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(canvas.width, canvas.height);
    const data = image.data;

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {

        // noise.simplex2 and noise.perlin2 for 2d noise
        const scale = 0.005;
        const value = 2 * Math.abs(noise.perlin2(x * scale, y * scale)) * 128 ;

        const cell = (x + y * canvas.width) * 4;
        data[cell] = data[cell + 1] = data[cell + 2] = value;
        // data[cell] += Math.max(0, (25 - value) * 8);
        data[cell + 3] = 255; // alpha.
      }
    }

    ctx.fillColor = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(image, 0, 0);
  }

  render() {
    const {} = this.props;
    return <canvas ref={this.drawNoise} width="800" height="800" style={{position: 'absolute', top:0, left: 0 }} />;
  }
}

