import React from 'react';
import PropTypes from 'prop-types';
import renderSeatMap from './renderer';

import './styles.scss';

const SeatMap = props => {

  const canvasRef = React.useRef(null);
  const [selection, setSelection] = React.useState(null);

  React.useLayoutEffect(()=>{
    let r = renderSeatMap({
      canvas: canvasRef.current,
      grid: props.config,
      onSelectionChange: function(data){
        setSelection(data);
        props.onSelectionChange(data);
      }
    });

    return function(){
      r.destroy();
    }
  },[]);

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
  config: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired
};

export default SeatMap;
