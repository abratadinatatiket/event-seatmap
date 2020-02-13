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
      maxCount: props.maxCount,
      grid: props.config,
      onSelectionChange: function(data){
        setSelection(data);
        props.onSelectionChange(data);
      },
      preselected: props.preselectedSeats
    });

    return function(){
      if(window.seatmapRenderer){
        window.seatmapRenderer.destroy();
      }
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
  stageLabel: 'STAGE',
  preselectedSeats: []
};

SeatMap.propTypes = {
  stageLabel: PropTypes.string,
  config: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  preselectedSeats: PropTypes.arrayOf(PropTypes.string)
};

export default SeatMap;
