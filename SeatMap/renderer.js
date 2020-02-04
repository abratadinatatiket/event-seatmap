import * as PIXI from 'pixi.js';

import VACANT_BMP from './bitmaps/vacant.png';
import VOID_BMP from './bitmaps/void.png';
import RESERVED_BMP from  './bitmaps/reserved.png';
import SELECTED_BMP from './bitmaps/selected.png';

const SEAT_WIDTH = 38;
const SEAT_HEIGHT = 38;
const SEAT_SPACE = 8;

const RESERVED_COLOR = '0xf15c59';
const VACANT_COLOR = '0xffffff';

const isVoid = function (obj) {
  return obj.status.toLowerCase() === 'void';
};

const isReserved = function (obj) {
  return obj.status.toLowerCase() === 'reserved';
};

// draw seats using PIXI.Graphics
function drawGraphics(obj) {

  let bg, alpha;
  if (!isVoid(obj)) {
    bg = isReserved(obj) ? RESERVED_COLOR : VACANT_COLOR;
    alpha = 1;
  } else {
    bg = 0;
    alpha = 0;
  }
  const sh = new PIXI.Graphics();
  sh.beginFill(parseInt(bg, 16), alpha);
  sh.lineStyle(2, parseInt(bg, 16), alpha);
  sh.drawRoundedRect(0, 0, SEAT_WIDTH, SEAT_HEIGHT, 4);
  sh.endFill();

  if (!isVoid(obj)) {

    const label = new PIXI.Text(obj.code, {
      fill: isReserved(obj) ? 0xffffff : 0x8a93a7,
      fontSize: 12,
      dropShadow: true,
      dropShadowAlpha: .1,
      dropShadowDistance: 0,
      align: 'center'
    });

    label.position.set((SEAT_WIDTH - label.width) * 0.5, SEAT_HEIGHT - 24);
    sh.addChild(label);

    // seat back
    const seatBottomShade = new PIXI.Graphics();

    if (isReserved(obj)) {
      seatBottomShade.beginFill(0xffffff, 0.5);
    } else {
      seatBottomShade.beginFill(0xc6cbda, 1);
    }

    seatBottomShade.drawRect(0, 0, 25, 8);
    seatBottomShade.endFill();
    seatBottomShade.position.set((SEAT_WIDTH - seatBottomShade.width) * 0.5, SEAT_HEIGHT - 8);
    sh.addChild(seatBottomShade);

    sh.cacheAsBitmap = true;
  }

  return sh;
}

/**
 * Draw seats using PIXI.Sprite & texture
 */
function drawBitmaps(obj) {

  const bitmaps = {
    vacant: VACANT_BMP,
    void: VOID_BMP,
    selected: SELECTED_BMP,
    reserved: RESERVED_BMP
  };

  let bmpName = 'vacant';

  if (isVoid(obj)) {
    bmpName = 'void';
  } else if (isReserved(obj)) {
    bmpName = 'reserved';
  }

  const sh = new PIXI.Sprite();
  sh.width = SEAT_WIDTH;
  sh.height = SEAT_HEIGHT;
  sh.texture = PIXI.Texture.from(bitmaps[bmpName]);

  if (!isVoid(obj)) {

    const label = new PIXI.Text(obj.code, {
      fill: isReserved(obj) ? 0xffffff : 0x8a93a7,
      fontSize: 12,
      dropShadow: true,
      dropShadowAlpha: .1,
      dropShadowDistance: 0,
      align: 'center'
    });

    label.position.set((SEAT_WIDTH - label.width) * 0.5, SEAT_HEIGHT - 24);
    sh.addChild(label);
    sh.cacheAsBitmap = true;
  }

  return sh;

}

export default function renderSeatMap(canvas, grid = [], onSeatClick, useBitmapAssets = true) {

  console.log('[renderSeatMap] ');

  // to avoid blurry text & lines
  PIXI.settings.ROUND_PIXELS = true;

  const STAGE_WIDTH = (grid[0].length * SEAT_WIDTH) + (SEAT_SPACE * (grid[0].length  - 1));
  const STAGE_HEIGHT = (grid.length * SEAT_HEIGHT) + (SEAT_SPACE * (grid.length - 1));

  const pixiapp = new PIXI.Application({
    width: STAGE_WIDTH ,
    height: STAGE_HEIGHT,
    view: canvas,
    transparent: true
  });

  function createSeats() {

    const seatContainer = new PIXI.Container();

    grid.forEach((row, i) => {

      row.forEach((obj, j) => {

        const sh = useBitmapAssets ? drawBitmaps(obj) : drawGraphics(obj);

        if (!isVoid(obj) && !isReserved(obj)) {
          sh.buttonMode = true;
          sh.interactive = true;

          sh.on('click', function () {
            onSeatClick(obj);
          });
        }

        if (j === 0) {
          sh.x = 0;
        } else {
          sh.x = (SEAT_WIDTH + SEAT_SPACE) * j;
        }

        if (i === 0) {
          sh.y = 0;
        } else {
          sh.y = (SEAT_HEIGHT + SEAT_SPACE ) * i;
        }

        seatContainer.addChild(sh);
      })
    });

    seatContainer.cacheAsBitmap = true;

    seatContainer.on('added', ()=>{
      console.log('[createSeats ] seat container ', seatContainer.width, seatContainer.height);
      console.log('[createSeats ] stage ', pixiapp.stage.width, pixiapp.stage.height);
    });

    return seatContainer;
  }

  pixiapp.stage.addChild(createSeats());

  return {
    destroy(){
      pixiapp.destroy(false, {
        children: true
      })
    }
  }

};
