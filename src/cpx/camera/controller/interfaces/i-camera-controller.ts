import { IVector2D } from "../../../utils/geom/vector";
import { Camera } from "../../camera";

export interface ICameraController {
  camera?: Camera;
  initialize?: () => void;
  onPOV?: (target: IVector2D) => void;
  onMove?: (target: IVector2D) => void;
  onZoom?: (zoom: number) => void;
  onRotate?: (rotation: number) => void;
  destroy: () => void;
}
