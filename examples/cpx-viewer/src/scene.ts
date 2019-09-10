import * as PIXI from 'pixi.js';
import { Back } from 'gsap';
import CPX from 'convex-pixel';
import { Inventory } from './inventory';
import { Ripple } from './ripple';
import { ISceneObject } from './interfaces';
import IScene from './interfaces/scene.interface';

export enum SceneEventTypes {
  REPOSITION = 'reposition',
}

export default class CPXScene<C extends CPX.core.App = any> extends CPX.display.BaseContainer {
  private _inventories = Array<Inventory<C, ISceneObject>>();

  private _selectedInventory: Inventory<C, ISceneObject>;

  private _container = new PIXI.Sprite();

  private _ripple = new Ripple();

  private _foregroundContainer = new PIXI.Sprite();

  private _completeAnimationOutHandler = (obj) => {
    if (obj.parent !== this._container) {
      this._foregroundContainer.removeChild(obj);
      this._container.addChild(obj);
    }
  };

  private _completeAnimationInHandler = (obj) => {
    obj.removeBlur();
  };

  private _startAnimationInHandler = (obj) => {};

  private _selectInventoryHandler = (target) => {
    this.selectedInventory = target;
  };

  constructor(appContext: C, protected _data: IScene) {
    super(appContext, null);

    this.addChild(this._container);
    this.addChild(this._ripple);
    this.addChild(this._foregroundContainer);

    this._ripple.interactive = true;

    this.build();
  }

  public build() {
    for (const objectData of this._data.objects) {
      const resource = CPX.core.ResourceManager.getResource(objectData.resource);
      const sprite = new Inventory(this.appContext, this, { ...objectData, ...resource });

      this._inventories.push(sprite);

      sprite.addListener('select', this._selectInventoryHandler);

      CPX.core.DomSynchronizer.add({
        id: objectData._id,
        groupId: objectData._groupId,
        object: sprite,
      });

      sprite.zIndex = objectData.depth * (objectData.staticDepth ? objectData.staticDepth : 0) * 100;
      sprite.rotation = objectData.rotation || 0;
      sprite.alpha = objectData.opacity || 1;

      this._container.addChild(sprite);
    }

    this._container.sortChildren();
  }

  private animateOut(obj, scale, pos) {
    this._ripple.out(obj.originalPosition.valueOf(), 0xffffff);
    obj.animatePOV();
    obj.tweenBlur.updateTo(
      {
        blur: 0,
        ease: Back.easeOut,
      },
      true
    );
    obj.tweenScale.updateTo(
      {
        ...scale,
        ease: Back.easeOut,
        onStart: undefined,
        onComplete: this._completeAnimationOutHandler,
        onCompleteParams: [obj],
      },
      true
    );
    obj.tweenPos.updateTo(
      {
        ...pos,
        ease: Back.easeOut,
      },
      true
    );
  }

  private animateIn(obj, scale, pos) {
    obj.animatePOV();
    this._ripple.in(obj.position, this.appContext.room.roomBound, 0xffffff);

    if (obj.parent !== this._foregroundContainer) {
      this._container.removeChild(obj);
      this._foregroundContainer.addChild(obj);
    }

    obj.tweenBlur.updateTo(
      {
        blur: 0,
        ease: Back.easeOut,
      },
      true
    );
    obj.tweenScale.updateTo(
      {
        ...scale,
        ease: Back.easeOut,
        onStart: this._startAnimationInHandler,
        onStartParams: [obj],
        onComplete: this._completeAnimationInHandler,
        onCompleteParams: [obj],
      },
      true
    );
    obj.tweenPos.updateTo(
      {
        ...pos,
        ease: Back.easeOut,
      },
      true
    );
  }

  private animateTo(obj, scale, pos) {
    // obj.addBlur();

    obj.tweenBlur.updateTo(
      {
        blur: 5,
        ease: Back.easeOut,
      },
      true
    );
    obj.tweenScale.updateTo(
      {
        ...scale,
        onStart: undefined,
        onComplete: this._completeAnimationOutHandler,
        onCompleteParams: [obj],
        ease: Back.easeOut,
      },
      true
    );
    obj.tweenPos.updateTo(
      {
        ...pos,
        ease: Back.easeOut,
      },
      true
    );
  }

  public set selectedInventory(v: Inventory<C, ISceneObject>) {
    if (this._selectedInventory === v) {
      this._selectedInventory = null;
    } else {
      this._selectedInventory = v;
    }

    this._inventories.forEach((inventory) => {
      if (v === inventory) {
        if (this._selectedInventory) {
          this.animateIn(
            inventory,
            { x: 3, y: 3 },
            {
              x: this.appContext.room.roomBound.width * 0.5,
              y: this.appContext.room.roomBound.height * 0.5,
            }
          );
        } else {
          this.animateOut(inventory, inventory.originalScale.valueOf(), inventory.originalPosition.valueOf());
        }
      } else {
        this.animateTo(inventory, inventory.originalScale.valueOf(), inventory.originalPosition.valueOf());
      }
    });
  }

  public destroy() {
    super.destroy();
  }
}
