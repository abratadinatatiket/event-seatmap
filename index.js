import * as PIXI from 'pixi.js';
import randomColor from 'randomcolor';
import random from 'lodash.random';
import chunk from 'lodash.chunk';

import './index.scss';

const mainContainer = document.getElementById('container');

const stage = new PIXI.Container();
const renderer = PIXI.autoDetectRenderer(
    {
      width: 4000,
      height: 4000,
      backgroundColor: 0xff0000
    }
);

mainContainer.appendChild(renderer.view);

function createSquares(w = 100,h= 100){
  const arr = [];

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

    stage.addChild(sh);

    arr.push(sh);
  }

  console.log('[createSquares] ', arr);

  const grid = chunk(arr, 100);

  grid.forEach( (row, i) =>{
    row.forEach( (g,j) =>{
      g.on('click', function(){
        alert(`clicked ${i}/${j}`)
      });
      g.x = w * j;
      g.y = h * i;

    })
  })

}

createSquares(40, 40);

renderer.render(stage);


