import CPX from 'convex-pixel';
import CPXScene from './scene';
import IScene, { ISceneObject } from './interfaces/scene.interface';

interface ICPXViewverRoomOptions {
  camera: CPX.camera.ICameraConfig;
  autosize: CPX.utils.display.RatioFitTypes;
}

export default class CPXViewverRoom<C extends CPX.core.App = any> extends CPX.display.BaseRoom<C> {
  protected _sceneCollection: IScene[];

  constructor(context: C, config: ICPXViewverRoomOptions) {
    super(context, {
      camera: {
        class: CPX.camera.Camera,
        config: config.camera,
        controllers: [
          CPX.camera.CameraMouseController,
          CPX.camera.CameraGyroscopeController,
          /*CPX.camera.CameraFaceTrackerController*/
        ],
      },
      autosize: config.autosize,
    });
  }

  protected buildScene() {
    const useExpanded = true;

    if (useExpanded) {
      const expandedCollectio = new Array<ISceneObject>();
      for (const s of this.scenes) {
        for (const o of s.objects) {
          o._groupId = s._id;
          if (!o.scale) o.scale = 1;
          if (!o.depth) o.depth = 0;
          // o.scale *= s.scale || 1;
          o.x = (o.x || 0) + (s.x || 0);
          o.y = (o.y || 0) + (s.y || 0);

          o.depth += s.depth || 0;
          expandedCollectio.push(o);
        }
      }

      // Нужен выделенный интерфейс
      const sceneDescriptor: IScene = { objects: expandedCollectio };

      const scene = new CPXScene(this.context, sceneDescriptor);
      this.addChild(scene);
      return;
    }

    for (const s of this.scenes) {
      const scene = new CPXScene(this.context, s);
      scene.x = s.x || 0;
      scene.y = s.y || 0;
      this.addChild(scene);
    }
  }

  public destroy() {
    this._sceneCollection = null;

    // need remove all scenes

    super.destroy();
  }

  public set scenes(v: IScene[]) {
    if (this._sceneCollection === v) return;

    this._sceneCollection = v;

    this.buildScene();
  }

  public get scenes() {
    return this._sceneCollection;
  }
}
