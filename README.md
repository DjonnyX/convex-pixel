# ConvexPixel

![cpx](https://user-images.githubusercontent.com/17039317/65000773-81561400-d8f5-11e9-9169-1ee59a12115b.gif)

A library for creating pseudo 3d interactive scenes based on web gl

## dependencies

- <https://github.com/pixijs>
- <https://github.com/greensock/GreenSock-JS>

## 🔧 Installation

```sh
yarn add convex-pixel
```

or

```sh
npm install convex-pixel
```

## Examples

Go checkout [examples](./examples) !

## Live demo

Look at the [demo](http://contents.eugene-grebennikov.pro/cpx/examples/) !

## Getting started

Let's demonstrate simple usage with basic example:

```ts
import CPX from "convex-pixel";

class App extends CPX.core.App<MyRoom> {

  constructor(appConfig: CPX.core.IAppConfig) {
    super(appConfig);

    this._room = new MyRoom(appConfig);

    this._room.setSize(DEFAULT_ROOM_WIDTH, DEFAULT_ROOM_HEIGHT);

    this.pixi.stage.addChild(this.room);

    this.createConvexObject();
  }

  private createConvexObject() {
    const cpxObj = new CPX.display.ConvexObject(this.appContext, {
      depth: 2.5;
      hitArea: [0,0,200,0,200,200,0,200];
      diffuseMap: "./assets/diffuse.png";
      depthMap: "./assets/depth.png";
      ...
    });

    scene.addChild(cpxObj);
  }
}

class MyRoom<C extends CPX.core.App = any> extends CPX.display.BaseRoom<C> {

  constructor(appContext: C) {
    super(appContext, {
      camera: {
        class: CPX.camera.Camera,
        config: {
          pov: 1;
          maxXOffset: 2;
          maxYOffset: 2;
          xOffset: 1;
          yOffset: 0.75
        },
        controllers: [
          CPX.camera.CameraMouseController,
          CPX.camera.CameraGyroscopeController,
        ],
      },
      autosize: CPX.utils.display.O_FILL,
    });
  }
}

const APP_CONFIG: CPX.core.IAppConfig = {
  transparent: true,
  view: document.getElementById('dom-el'),
}

new App(APP_CONFIG);
```

## MIT License

Copyright (c) 2019 djonnyx <djonnyx@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
