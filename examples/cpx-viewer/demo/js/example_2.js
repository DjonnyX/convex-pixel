// eslint-disable-next-line no-undef
const CPXV = CPXViewer.default;

const MOCK_SCENES = {
  camera: {
    dof: 2,
    povFactor: 1,
    maxXOffset: 15,
    maxYOffset: 15,
    xOffset: 2,
    yOffset: 2,
  },
  room: {
    width: 1920,
    height: 1280,
    autosize: 1,
  },
  scenes: [
    {
      objects: [
        {
          diffuseMap: 'http://www.contents.eugene-grebennikov.pro/cpx/examples/8e26091ed15572d998bc8a1b97f4c5da.png',
          depthMap: 'http://www.contents.eugene-grebennikov.pro/cpx/examples/560d17187cb8b1c6aabe00f8adb6c255.png',
          x: 960,
          y: 640,
          isBackground: true,
          depth: 1,
          scale: 1,
        },
      ],
    },
  ],
};

new CPXV(MOCK_SCENES, {
  transparent: true,
  view: document.getElementById('cpx-viewer'),
});
