import * as PIXI from 'pixi.js';
import randomColor from 'randomcolor';
import chunk from 'lodash.chunk';

export default function renderSeatMap(canvas){

  const pixiapp = new PIXI.Application({
    width: 4000,
    height: 4000,
    view: canvas
  });

  function createSeats(w = 40, h = 40){
    const arr = [];
    const seatContainer = new PIXI.Container();

    while(arr.length < 10000){
      const bg = randomColor().replace('#','');
      const line = randomColor().replace('#','');
      const sh = new PIXI.Graphics();
      sh.beginFill(parseInt(bg, 16));
      sh.lineStyle(2, parseInt(line, 16), 1);
      sh.drawRoundedRect(0,0, w, h, 8);
      sh.endFill();
      sh.cursor = 'pointer';
      sh.interactive = true;

      seatContainer.addChild(sh);

      arr.push(sh);
    }

    const grid = chunk(arr, 100);

    grid.forEach( (row, i) =>{
      row.forEach( (g,j) =>{
        g.on('click', function(){
          alert(`clicked ${i}/${j}`)
        });
        g.x = w * j;
        g.y = h * i;

        const label = new PIXI.Text(`${i}/${j}`, {
          fill: 0xffffff,
          fontSize: 10,
          align: 'center'
        });

        g.addChild(label);

      })
    });
    seatContainer.cacheAsBitmap = true;
    return seatContainer;
  }

  pixiapp.stage.addChild(createSeats());

};
