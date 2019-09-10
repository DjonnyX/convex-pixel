import CPXViewverRoom from './room';
import CPX from 'convex-pixel';
import IScene from './interfaces/scene.interface';

export interface IMenuConfig {
  camera: CPX.camera.ICameraConfig;
  room: {
    autosize: CPX.utils.display.RatioFitTypes;
    width: number;
    height: number;
  };
  resources: {
    [x: string]: CPX.display.IConvexObjectConfig;
  };
  scenes: IScene[];
}

const DEFAULT_ROOM_WIDTH = 800;
const DEFAULT_ROOM_HEIGHT = 640;

export class CPXViewver extends CPX.core.App<CPXViewverRoom> {
  private _resourceManager: CPX.core.ResourceManager;

  constructor(config: IMenuConfig, appConfig: CPX.core.IAppConfig) {
    super(appConfig);

    this._resourceManager = new CPX.core.ResourceManager(config.resources);

    this._room = new CPXViewverRoom(this, {
      camera: config.camera,
      autosize: config.room.autosize,
    });

    if (config.room) {
      this.room.setSize(config.room.width || DEFAULT_ROOM_WIDTH, config.room.height || DEFAULT_ROOM_HEIGHT);
    } else {
      this.room.setSize(DEFAULT_ROOM_WIDTH, DEFAULT_ROOM_HEIGHT);
    }
    this.pixi.stage.addChild(this.room);

    this.room.scenes = config.scenes;
  }

  protected resize(width: number, height: number) {
    super.resize(width, height);

    if (this.room) {
      this.room.setViewport(width, height);
    }
  }

  public setScenes(scenes: IScene[]) {
    this.room.scenes = scenes;
  }

  public dispose() {
    this.pixi.stage.removeChild(this.room);
    this.room.destroy();

    this._resourceManager.dispose();
  }
}
