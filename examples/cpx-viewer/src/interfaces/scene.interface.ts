import CPX from 'convex-pixel';

interface IMoveableObject {
  x?: number;
  y?: number;
}

export interface ISceneObject extends CPX.display.IConvexObjectConfig {
  _id: number | string;
  _groupId?: number | string;
  resource?: string;
  staticDepth?: number;
  opacity?: number;
  rotation?: number;
}

export default interface IScene extends IMoveableObject {
  _id?: number | string;
  depth?: number;
  scale?: number;
  objects: ISceneObject[];
}
