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
        <div className="stage">{props.stageLabel}</div>
        <div className="canvas-container">
          <canvas ref={canvasRef}/>
        </div>
      </div>
  )
};

SeatMap.defaultProps = {
  stageLabel: 'STAGE'
};

SeatMap.propTypes = {
  stageLabel: PropTypes.string,
  config: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    status: PropTypes.string.isRequired
  })).isRequired,
  onSeatClick: PropTypes.func.isRequired
};

export default SeatMap;
