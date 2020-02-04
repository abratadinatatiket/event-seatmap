import * as PIXI from 'pixi.js';

import VACANT_BMP from './bitmaps/vacant.png';
import VOID_BMP from './bitmaps/void.png';
import RESERVED_BMP from  './bitmaps/reserved.png';
import SELECTED_BMP from './bitmaps/selected.png';

const bitmaps = {
  vacant: VACANT_BMP,
  void: VOID_BMP,
  selected: SELECTED_BMP,
  reserved: RESERVED_BMP
};

const SEAT_LABEL_COLORS = {
  VACANT: 0x8a93a7,
  SELECTED: 0xffffff,
  RESERVED: 0xffffff
};

const SEAT_WIDTH = 38;
const SEAT_HEIGHT = 38;
const SEAT_SPACE = 8;

const isVoid = function (obj) {
  return obj.status.toLowerCase() === 'void';
};

const isReserved = function (obj) {
  return obj.status.toLowerCase() === 'reserved';
};

const updateSeatLabel = function(sh, lbl, color){

  if(sh.label){
    sh.removeChild(sh.label);
  }

  const label = new PIXI.Text(lbl, {
    fill: color,
    fontSize: 12,
    align: 'center'
  });

  label.position.set((SEAT_WIDTH - label.width) * 0.5, SEAT_HEIGHT - 24);
  sh.addChild(label);
  sh.label = label;
};

/**
 * Draw seats using PIXI.Sprite & texture
 */
function drawBitmaps(obj) {

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

    updateSeatLabel(sh, obj.code, isReserved(obj) ? SEAT_LABEL_COLORS.RESERVED : SEAT_LABEL_COLORS.VACANT);

    if(!isReserved(obj)){
      sh.data = {
        code: obj.code,
        selected: false
      };
    }
  }

  return sh;

}

export default function renderSeatMap({canvas, grid = [], onSelectionChange, waitMessage}) {

  const selectedSeats = {};

  console.log('[renderSeatMap] ');

  // to avoid blurry text & lines
  PIXI.settings.ROUND_PIXELS = true;

  const COLS = grid[0].length;
  const ROWS = grid.length;

  const STAGE_WIDTH = ( COLS * SEAT_WIDTH) + (SEAT_SPACE * (COLS  - 1));
  const STAGE_HEIGHT = ( ROWS * SEAT_HEIGHT) + (SEAT_SPACE * (ROWS - 1));

  const pixiapp = new PIXI.Application({
    width: STAGE_WIDTH ,
    height: STAGE_HEIGHT,
    view: canvas,
    transparent: true
  });

  const seatContainer = new PIXI.Container();
  seatContainer.width = STAGE_WIDTH;
  seatContainer.height = STAGE_HEIGHT;

  const waitingLabel = new PIXI.Text(waitMessage || `Generating ${COLS * ROWS} seats...`,{
    fill: PIXI.utils.string2hex('#aaaaaa'),
    fontSize: 12,
    align: 'center'
  });
  waitingLabel.position.set(20,20);
  seatContainer.addChild(waitingLabel);

  seatContainer.on('added', ()=>{
    console.log('[renderSeatMap seatContainer added] ');
    setTimeout(()=>{
      createSeats();
    }, 100);
  });

  function createSeats() {

    grid.forEach((row, i) => {

      row.forEach((obj, j) => {

        const sh = drawBitmaps(obj);

        if (!isVoid(obj) && !isReserved(obj)) {
          sh.buttonMode = true;
          sh.interactive = true;

          sh.on('click', function () {

            if(sh.data.selected){
              sh.data.selected = false;
              sh.texture = PIXI.Texture.from(bitmaps['vacant']);
              updateSeatLabel(sh, sh.data.code, SEAT_LABEL_COLORS.VACANT);
              delete selectedSeats[sh.data.code];
            }else{
              sh.data.selected = true;
              sh.texture = PIXI.Texture.from(bitmaps['selected']);
              updateSeatLabel(sh, sh.data.code, SEAT_LABEL_COLORS.SELECTED);
              selectedSeats[sh.data.code] = true;
            }

            onSelectionChange(selectedSeats);

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

        if(waitingLabel && waitingLabel.parent === seatContainer){
          seatContainer.removeChild(waitingLabel);
          waitingLabel.destroy();
        }
      })
    });

  }

  pixiapp.stage.addChild(seatContainer);

  return {
    destroy(){
      console.log('[seatMapRenderer] destroy');
      pixiapp.destroy(false, {
        children: true,
        texture: true,
        baseTexture: true
      })
    }
  }

};
