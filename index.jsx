import React from 'react';
import { render } from 'react-dom';
import renderSeatMap from './renderer';

import './index.scss'

function App(){

  const canvasRef = React.useRef(null);

  React.useEffect(()=>{
    renderSeatMap(canvasRef.current);
  },[canvasRef.current]);


  return (
      <div className="app">
        <div className="seatmap-container" >
          <canvas id="seatmap-canvas" ref={canvasRef} />
        </div>
      </div>
  )
}

render( <App/>, document.getElementById('container'));
