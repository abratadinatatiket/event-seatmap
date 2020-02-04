import React from 'react';
import PropTypes from 'prop-types';
import renderSeatMap from './renderer';

import './styles.scss';

const SeatMap = props => {

  const canvasRef = React.useRef(null);

  React.useLayoutEffect(()=>{
    let r = renderSeatMap(canvasRef.current, props.config, props.onSeatClick);

    return function(){
      r.destroy();
    }
  },[canvasRef.current, props.config]);

  return (
      <div className="seatmap">
        <canvas ref={canvasRef}/>
      </div>
  )
};

SeatMap.defaultProps = {};

SeatMap.propTypes = {
  config: PropTypes.array,
  onSeatClick: PropTypes.func.isRequired
};

export default SeatMap;
