import * as PIXI from "pixi.js";
import { TweenMax, Expo } from "gsap";
import CPX from "convex-pixel";

export class Ripple extends PIXI.Sprite {
  protected _rippleShape: PIXI.Graphics;

  protected _helper = CPX.utils.geom.Vector3D.new();

  protected _tween: TweenMax;

  private _updateHandler = (color: number) => {
    this.draw(this._helper, color);
  };

  constructor() {
    super();
    this._rippleShape = new PIXI.Graphics();
    this.addChild(this._rippleShape);

    this._tween = new TweenMax(this._helper, 0.75, {});
  }

  public in(from: CPX.utils.geom.IVector2D, bound: CPX.utils.geom.IRect, color: number) {
    const radius =
      Math.sqrt(Math.pow(bound.width, 2) + Math.pow(bound.height, 2)) * 0.5;
    this._helper.x = from.x;
    this._helper.y = from.y;
    this._helper.z = 0;

    this._tween.updateTo(
      {
        x: bound.x + bound.width * 0.5,
        y: bound.y + bound.height * 0.5,
        z: radius,
        onUpdate: this._updateHandler,
        onUpdateParams: [color],
        ease: Expo.easeOut
      },
      true
    );
  }

  public out(to: CPX.utils.geom.IVector2D, color: number) {
    this._tween.updateTo(
      {
        x: to.x,
        y: to.y,
        z: 0,
        onUpdate: this._updateHandler,
        onUpdateParams: [color]
      },
      true
    );
  }

  protected draw(target: CPX.utils.geom.IVector3D, color: number) {
    this._rippleShape.clear();
    this._rippleShape.beginFill(color);
    this._rippleShape.drawCircle(target.x, target.y, target.z);
    this._rippleShape.endFill();
  }

  public dispose() {
    this._helper.free();

    this._rippleShape.destroy();
    this._rippleShape = null;

    this._tween.kill();

    super.destroy({ children: true });
  }
}
