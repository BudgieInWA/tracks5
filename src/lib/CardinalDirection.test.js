import _ from 'lodash';
import CardinalDirection from './CardinalDirection';

const dir = CardinalDirection.N;

describe('API', () => {
  it('N, NE, SE, S, SW, NW', () => {
    expect( CardinalDirection.N  ).toBeInstanceOf(CardinalDirection);
    expect( CardinalDirection.NE ).toBeInstanceOf(CardinalDirection);
    expect( CardinalDirection.SE ).toBeInstanceOf(CardinalDirection);
    expect( CardinalDirection.S  ).toBeInstanceOf(CardinalDirection);
    expect( CardinalDirection.SW ).toBeInstanceOf(CardinalDirection);
    expect( CardinalDirection.NW ).toBeInstanceOf(CardinalDirection);
  });

  it('instances have left and right', () => {
    expect(dir.left.left.left.left.left.left).toBe(dir);
    expect(dir.right.right.right.right.right.right).toBe(dir);
  });

  it('reverse(dir)', () => {
    expect(CardinalDirection.reverse(dir)).toBeInstanceOf(CardinalDirection);
  });

  it('can be rendered to a string and restored with of()', () => {
    const str = dir.toString();
    expect(typeof str).toBe(typeof '');
    const restoredDir = CardinalDirection.of(str);
    const restoredStr = restoredDir.toString();
    expect(restoredDir).toBe(dir);
    expect(restoredStr).toBe(str);
  })
});
