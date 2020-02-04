import * as PIXI from 'pixi.js';

import VACANT_BMP from './bitmaps/vacant.png';
import VOID_BMP from './bitmaps/void.png';
import RESERVED_BMP from  './bitmaps/reserved.png';
import SELECTED_BMP from './bitmaps/selected.png';

const BITMAPS = {
  vacant: VACANT_BMP,
  void: VOID_BMP,
  selected: SELECTED_BMP,
  reserved: RESERVED_BMP
};

const SEAT_LABEL_COLORS = {
  vacant: 0x8a93a7,
  selected: 0xffffff,
  reserved: 0xffffff
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

  const ts = new PIXI.TextStyle({
    fill: color,
    fontSize: 12,
    align: 'center',
    // make it a little thicker
    // on retina screen
    stroke: 'black',
    strokeThickness: 0.3
  });

  if(!sh.label){
    const label = new PIXI.Text(lbl, ts);
    label.position.set((SEAT_WIDTH - label.width) * 0.5, SEAT_HEIGHT - 24);
    sh.addChild(label);
    sh.label = label;
  }else{
    sh.label.style = ts;
  }

};

const updateSeatTexture = function(sh, texture){
  sh.texture = PIXI.Texture.from(texture);
};

/**
 * Draw seats using PIXI.Sprite & texture
 */
function drawBitmaps(obj, preselected = false) {

  const sh = new PIXI.Sprite();
  sh.width = SEAT_WIDTH;
  sh.height = SEAT_HEIGHT;

  if (!isVoid(obj)) {

    if(!isReserved(obj)){
      sh.data = {
        code: obj.code,
        selected: preselected
      };
      updateSeatTexture(sh, preselected ? BITMAPS.selected: BITMAPS.vacant);
      updateSeatLabel(sh, obj.code, preselected ? SEAT_LABEL_COLORS.selected : SEAT_LABEL_COLORS.vacant);
    }else{
      updateSeatLabel(sh, obj.code, SEAT_LABEL_COLORS.reserved);
      updateSeatTexture(sh, BITMAPS.reserved);
    }
  }else{
    updateSeatTexture(sh, BITMAPS.void);
  }

  return sh;

}

export default function renderSeatMap({canvas, grid = [], onSelectionChange, waitMessage, preselected = []}) {

  const selectedSeats = {};

  if(preselected.length > 0){
    preselected.forEach(s=>{
      selectedSeats[s] = true;
    })
  }

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

        const sh = drawBitmaps(obj, preselected.indexOf(obj.code) > -1);

        if (!isVoid(obj) && !isReserved(obj)) {
          sh.buttonMode = true;
          sh.interactive = true;

          sh.on('click', function () {

            if(sh.data.selected){
              sh.data.selected = false;
              updateSeatTexture(sh, BITMAPS.vacant);
              updateSeatLabel(sh, sh.data.code, SEAT_LABEL_COLORS.vacant);
              delete selectedSeats[sh.data.code];
            }else{
              sh.data.selected = true;
              updateSeatTexture(sh, BITMAPS.selected);
              updateSeatLabel(sh, sh.data.code, SEAT_LABEL_COLORS.selected);
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
