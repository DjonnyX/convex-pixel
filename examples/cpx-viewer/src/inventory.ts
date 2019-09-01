import * as PIXI from 'pixi.js';
import { TweenMax, Expo, Linear } from 'gsap';
import CPX from 'convex-pixel';

export class Inventory<C extends CPX.display.IConvexObjectConfig> extends CPX.display.ConvexObject<C> {
  public readonly tweenPos: TweenMax;

  public readonly tweenScale: TweenMax;

  public readonly tweenBlur: TweenMax;

  private _tweenPOV: TweenMax;

  private _tweenCircularPOVBack: TweenMax;

  private _tweenCircularPOV: TweenMax;

  public readonly blurFilter: PIXI.filters.BlurFilter;

  private _originalScale = CPX.utils.geom.Vector2D.new(1, 1);

  private _originalZIndex = this._zIndex;

  private _originalPosition = CPX.utils.geom.Vector2D.new();

  private _animatedPOV = CPX.utils.geom.Vector2D.new();

  private _animatedCircularPOV = CPX.utils.geom.Vector2D.new();

  private _actualPov = CPX.utils.geom.Vector2D.new();

  private _clickHandler = () => {
    this.emit('select', this);
  };

  constructor(stage: CPX.display.BaseContainer, config: C) {
    super(stage, config);

    if (config.interactive) {
      this._container.addListener('rightclick', this._clickHandler);
      this._container.addListener('pointertap', this._clickHandler);

      this.tweenPos = new TweenMax(this.position, 1, {});
      this.tweenScale = new TweenMax(this.scale, 1, {});

      this.blurFilter = new PIXI.filters.BlurFilter(1, 2, 1);
      this.blurFilter.blur = 0;
      this.tweenBlur = new TweenMax(this.blurFilter, 1, {});

      this._tweenPOV = new TweenMax(this._animatedCircularPOV, 2.4, {
        bezier: {
          tepe: 'quadratic',
          values: [
            /*p1*/
            { x: 0, y: 0 },
            { x: -5, y: -2 },
            { x: 0, y: 0 },
            /*p2*/
            { x: 5, y: 2 },
            { x: 0, y: 0 },
          ],
        } /*bezier end*/,
        onUpdate: this._animationUpdatePOVHandler,
        onComplete: this._animationCompletePOVHandler,
        ease: Expo.easeOut,
        paused: true,
      });

      this._tweenCircularPOV = new TweenMax(this._animatedCircularPOV, 9, {
        bezier: {
          tepe: 'quadratic',
          values: [
            { x: 0, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: -1 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: 0 },
            /*p4*/
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 1 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
            { x: 0, y: 0 },
          ],
        } /*bezier end*/,
        onUpdate: this._animationUpdateCircularPOVHandler,
        onComplete: this._animationCompleteCircularPOVHandler,
        ease: Linear.easeNone,
        paused: true,
      });

      this._tweenCircularPOVBack = new TweenMax(this._animatedCircularPOV, 1, {});
    }
  }

  private _animationUpdatePOVHandler = () => {
    this.recalculateCameraPOV();
  };

  private _animationCompletePOVHandler = () => {
    this._tweenCircularPOV.repeat(-1);
    this._tweenCircularPOV.reverse();
    this._tweenCircularPOV.play(0);
  };

  private _animationUpdateCircularPOVHandler = () => {
    this.recalculateCameraPOV();
  };

  private _animationCompleteCircularPOVHandler = () => {};

  public animatePOV() {
    this._tweenCircularPOVBack.kill();
    this._tweenPOV.play(0);
  }

  /**
   * @override
   */
  public setPOV(x: number, y: number) {
    this._actualPov.set(x, y);
    super.setPOV(
      x + this._animatedPOV.x * 0.5 * this.scale.x + this._animatedCircularPOV.x * 1.15 * this.scale.x,
      y + this._animatedPOV.y * this.scale.y + this._animatedCircularPOV.y * this.scale.y
    );
  }

  protected loadingComplete() {
    super.loadingComplete();

    this.position.set(this._config.x, this._config.y);

    this._originalScale.from(this.scale);
    this._originalPosition.from(this.position);
    this._originalZIndex = this._zIndex;
  }

  public addBlur() {
    this._container.filters = [this.blurFilter];
  }

  public removeBlur() {
    this._container.filters = [];
  }

  public destroy() {
    if (this.tweenPos) {
      this.tweenPos.kill();
    }
    if (this.tweenScale) {
      this.tweenScale.kill();
    }
    if (this.tweenBlur) {
      this.tweenBlur.kill();
    }
    if (this._tweenPOV) {
      this._tweenPOV.kill();
    }
    if (this._tweenCircularPOV) {
      this._tweenCircularPOV.kill();
    }
    if (this._tweenCircularPOVBack) {
      this._tweenCircularPOVBack.kill();
    }

    this._actualPov.free();
    this._animatedPOV.free();
    this._animatedCircularPOV.free();
    this._originalScale.free();
    this._originalPosition.free();

    super.destroy();
  }

  public get originalScale() {
    return this._originalScale;
  }

  public get originalZIndex() {
    return this._originalZIndex;
  }

  public get originalPosition() {
    return this._originalPosition;
  }
}
