import React from 'react';
import { render } from 'react-dom';
import SeatMap from './SeatMap';

import seatCfg from './seats-1500.json';

import Modal from '@material-ui/core/Modal';

import './index.scss';

function App(){

  const [showMap, setShowMap] = React.useState(false);

  return (
      <div className="app">
        <button onClick={()=>{ setShowMap(true) }}>Show Map</button>

        <Modal open={showMap}>
          <div className="seatmap-modal">
            <SeatMap
                config={seatCfg}
                onSeatClick={(obj)=> { alert(JSON.stringify(obj))}}
            />
            <button onClick={()=>{ setShowMap(false) }}>Close Map</button>
          </div>
        </Modal>

      </div>
  )
}

render( <App/>, document.getElementById('container'));
