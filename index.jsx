import React from 'react';
import { render } from 'react-dom';
import SeatMap from './SeatMap';

import seatCfg from './seats.json';

function App(){

  return (
      <div className="app">
        <SeatMap
            config={seatCfg}
            onSeatClick={(obj)=> { alert(JSON.stringify(obj))}}
        />
      </div>
  )
}

render( <App/>, document.getElementById('container'));
