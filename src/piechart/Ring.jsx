import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import getSliceRadius from './getSliceRadius';
import Slice from './Slice';

export default class Ring extends Component {
  static propTypes = {
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { slices, level, hole, radius, center, stroke, strokeWidth,
            factor, onClick, className, getSliceClassName, getColor } = this.props;
    const sliceRadius = getSliceRadius(hole, radius, level, factor);
    const rectSize = sliceRadius.end + 20;
    const hasChildren = s => s.data.children && s.data.children.length > 0;

    return (
      <g className={className}>
        <rect x={center - rectSize} y={center - rectSize}
              width={rectSize * 2} height={rectSize * 2}
              fill='transparent' style={{visibility: 'none', pointerEvents: 'none'}} />
        {slices.map((slice, idx) =>
            <Slice key={idx}
                   data={slice.data}
                   startAngle={slice.start}
                   angle={slice.end - slice.start}
                   percentValue={slice.percentValue.toFixed(1)}
                   fill={getColor(level, idx)}
                   {...{ hole, center, stroke, strokeWidth, sliceRadius }}
                   onClick={onClick}
                   level={level}
                   parentSlices={slice.parentSlices}
                   className={getSliceClassName(level, idx, hasChildren(slice))} />
        )}
      </g>
    );
  }
}
