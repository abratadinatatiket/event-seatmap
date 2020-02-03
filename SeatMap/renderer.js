import * as PIXI from 'pixi.js';
import randomColor from 'randomcolor';
import chunk from 'lodash.chunk';

export default function renderSeatMap(canvas, grid = [], onSeatClick){

  const SEAT_WIDTH = 40;
  const SEAT_HEIGHT = 40;
  const SEAT_SPACE = 10;

  const pixiapp = new PIXI.Application({
    width: (grid[0].length * SEAT_WIDTH) + (SEAT_SPACE * grid[0].length - 1),
    height: (grid.length * SEAT_HEIGHT) + (SEAT_SPACE * grid.length - 1),
    view: canvas
  });

  function createSeats(w = 40, h = 40){

    const seatContainer = new PIXI.Container();

    grid.forEach( (row, i) =>{
      row.forEach( (obj,j) =>{

        const bg = obj.status !== 'void' ? randomColor().replace('#',''): 0;
        const line = obj.status !== 'void' ? randomColor().replace('#',''): 0;
        const sh = new PIXI.Graphics();
        sh.beginFill(parseInt(bg, 16));
        sh.lineStyle(2, parseInt(line, 16), 1);
        sh.drawRoundedRect(0,0, SEAT_WIDTH, SEAT_HEIGHT, 8);
        sh.endFill();
        sh.cursor = 'pointer';
        sh.interactive = true;

        if(obj.status !== 'void'){

          const label = new PIXI.Text(`${i}/${j}`, {
            fill: 0xffffff,
            fontSize: 10,
            align: 'center'
          });

          sh.addChild(label);

          sh.on('click', function(){
            onSeatClick(obj);
          });
        }

        if(j === 0){
          sh.x = SEAT_WIDTH * j;
        } else {
          sh.x = (SEAT_WIDTH * j) + (SEAT_SPACE * j);
        }

        if(i === 0){
          sh.y = SEAT_HEIGHT * i;
        } else {
          sh.y = (SEAT_HEIGHT * i) + (SEAT_SPACE * i);
        }

        seatContainer.addChild(sh);

      })
    });

    seatContainer.cacheAsBitmap = true;

    return seatContainer;
  }

  pixiapp.stage.addChild(createSeats());

};
