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
  background: './assets/background.png',
  room: {
    width: 1920,
    height: 1080,
    autosize: 1,
  },
  scenes: [
    {
      objects: [
        {
          diffuseMap: 'contents/examples/3ba14cefb7a319f44e00d710f845bbf5.png',
          depthMap: 'contents/examples/52de722efd3f3f45dd042eded7316e06.png',
          x: 960,
          y: 540,
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
