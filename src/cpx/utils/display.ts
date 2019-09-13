import { IVector2D, Vector4D } from "./geom/vector";

export enum RatioFitTypes {
  NONE,
  FILL,
  SHOW_ALL,
  O_FILL,
  O_SHOW_ALL,
}

export const getRatio = (
  width1: number,
  height1: number,
  width2: number,
  height2: number,
  type: RatioFitTypes = RatioFitTypes.NONE
): number => {
  let ratioX: number;
  let ratioY: number;

  switch (type) {
    case RatioFitTypes.SHOW_ALL:
      ratioX = width2 / width1;
      ratioY = height2 / height1;
      return Math.min(ratioX, ratioY);
    case RatioFitTypes.FILL:
      ratioX = width2 / width1;
      ratioY = height2 / height1;
      return Math.max(ratioX, ratioY);
    case RatioFitTypes.O_SHOW_ALL:
      ratioX = width2 < width1 ? width2 / width1 : width1 / width2;
      ratioY = height2 < height1 ? height2 / height1 : height1 / height2;
      return Math.min(ratioX, ratioY);
    case RatioFitTypes.O_FILL:
      ratioX = width2 < width1 ? width2 / width1 : width1 / width2;
      ratioY = height2 < height1 ? height2 / height1 : height1 / height2;
      return Math.min(ratioX, ratioY);
    case RatioFitTypes.NONE:
    default:
      return 1;
  }
};

export interface IHierarchicalObject extends IVector2D {
  parent: IHierarchicalObject;
  scale: IVector2D;
  width: number;
  height: number;
}

export const getAbsolutePosition = (
  object: IHierarchicalObject,
  options?: {
    to?: new (...args: any) => any;
  },
  iteration = 0
): Vector4D => {
  let _to: (new (...args: any) => any) | undefined;
  if (options && options.to) {
    _to = options.to;
  }

  if (!object) {
    return Vector4D.new();
  }

  const result = Vector4D.new(object.x, object.y, object.scale.x, object.scale.y);

  if (object.parent) {
    const isVect = _to && object.parent instanceof _to;

    // if (!isVect) {
    const parentPos = getAbsolutePosition(object.parent, options, iteration++);
    result.x += parentPos.x || 0;
    result.y += parentPos.y || 0;
    result.z *= parentPos.z || 1;
    result.t *= parentPos.t || 1;

    parentPos.free();
    // }
  }

  return result;
};
