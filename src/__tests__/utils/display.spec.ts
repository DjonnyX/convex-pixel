import {
  getRatio,
  RatioFitTypes,
  IHierarchicalObject
} from "../../cpx/utils/display";


/*class BaseDisplayObject implements IHierarchicalObject {
  public parent: BaseDisplayObject;
  public scale: { x: 1; y: 1 };
  public width: number;
  public height: number;
  constructor(public x: number, public y: number) {}
}

// tslint:disable-next-line: max-classes-per-file
class DisplayObjectA extends BaseDisplayObject {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

// tslint:disable-next-line: max-classes-per-file
class DisplayObjectB extends BaseDisplayObject {
  constructor(x: number, y: number) {
    super(x, y);
  }
}

// tslint:disable-next-line: max-classes-per-file
class DisplayObjectC extends BaseDisplayObject {
  constructor(x: number, y: number) {
    super(x, y);
  }
}*/

describe("Display utils", () => {
  describe("getRatio", () => {
    it("Should to fill the space (pass 1)", () => {
      const result = getRatio(400, 200, 100, 100, RatioFitTypes.FILL);
      expect(result).toBe(0.5);
    });

    it("Should to fill the space (pass 2)", () => {
      const result = getRatio(200, 400, 200, 100, RatioFitTypes.FILL);
      expect(result).toBe(1);
    });

    it("Should to fill the space (pass 3)", () => {
      const result = getRatio(500, 500, 50, 100, RatioFitTypes.FILL);
      expect(result).toBe(0.2);
    });

    it("Gotta show all (pass 1)", () => {
      const result = getRatio(400, 200, 100, 100, RatioFitTypes.SHOW_ALL);
      expect(result).toBe(0.25);
    });

    it("Gotta show all (pass 2)", () => {
      const result = getRatio(200, 400, 50, 100, RatioFitTypes.SHOW_ALL);
      expect(result).toBe(0.25);
    });

    it("Gotta show all (pass 3)", () => {
      const result = getRatio(100, 400, 100, 200, RatioFitTypes.SHOW_ALL);
      expect(result).toBe(0.5);
    });

    it("Gotta show all (pass 4)", () => {
      const result = getRatio(100, 100, 100, 100, RatioFitTypes.SHOW_ALL);
      expect(result).toBe(1);
    });

    it("Must show a natural scale", () => {
      const result = getRatio(400, 200, 100, 100, RatioFitTypes.NONE);
      expect(result).toBe(1);
    });
  });
});
