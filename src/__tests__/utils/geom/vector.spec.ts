jest.mock("../../../environment", () => ({
  IS_DEV: true,
  IS_PROD: false,
}))

import { Vector2D } from "../../../cpx/utils/geom/";

describe("Vector utils", () => {
  describe("Vector2D", () => {
    it("should correctly set the position in the constructor", () => {
      expect(new Vector2D(10, 20).valueOf()).toEqual({ x: 10, y: 20 });
    });

    it("should correctly set the position in the set method", () => {
      expect(new Vector2D().set(10, 20).valueOf()).toEqual({ x: 10, y: 20 });
    });

    it("should be get from the pool correctly", () => {
      const poolCount = Vector2D.poolCount;
      // tslint:disable-next-line: no-unused-expression
      new Vector2D();
      expect(Vector2D.poolCount - poolCount).toBe(0);
    });

    it("should be removed from the pool correctly", () => {
      const vector = new Vector2D();
      const poolCount = Vector2D.poolCount;
      vector.free();
      expect(Vector2D.poolCount - poolCount).toBe(1);
    });
  });
});
