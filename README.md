# ConvexPixel

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

const app = new CPX.core.App();

const room = new CPX.display.BaseRoom({
  camera: {
    class: Camera,
    config: {
      ...
    },
    controllers: [CameraFaceTrackerController, CameraMouseController, CameraGyroscopeController]
  },
  autosize: true
});

const cpxObj = new CPX.display.ConvexObject(this, {
  depth: 2.5;
  hitArea: [0,0,200,0,200,200,0,200];
  diffuseMap: "../assets/diffuse.png";
  depthMap: "../assets/depth.png";
  ...
});

scene.addChild(cpxObj);

```

## Credits

Developer - Eugene Grebennikov (@djonnyx)

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
