// http://codepen.io/maydie/details/OVmxZZ

import React, { Component, PropTypes } from 'react';
import getAnglePoint from './getAnglePoint';

export default class Slice extends Component {
  static defaultProps = {
    parentSlices: [],
    factor: 0.7,
    steps: 3,
    strokeWidth: 3
  }

  drawPath () {
    var p = this.props, path = [], a, b;

    var center = p.center;
    var angle = Math.min(p.angle, 359.9999);
    const startRadius = p.sliceRadius.start;
    const endRadius = p.sliceRadius.end;

    // Get angle points
    a = getAnglePoint(p.startAngle, p.startAngle + angle, endRadius, 0, 0);
    b = getAnglePoint(p.startAngle, p.startAngle + angle, startRadius, 0, 0);

    path.push(`M${a.x1},${a.y1}`);
    path.push(`A${endRadius},${endRadius} 0 ${(angle > 180 ? 1 : 0)},1 ${a.x2},${a.y2}`);
    if (p.angle < 360) {
      path.push(`L${b.x2},${b.y2}`);
    } else {
      path.push(`M${b.x2},${b.y2}`);
    }
    if (startRadius > 0) {
      path.push(`A${startRadius},${startRadius} 0 ${(angle > 180 ? 1 : 0)},0 ${b.x1},${b.y1}`);
    }

    // Close
    path.push('Z');

    return path.join(' ');
  }

  render () {
    return (
      <path d={ this.drawPath() }
            fill={ this.props.fill }
            stroke={ this.props.stroke }
            strokeWidth={ this.props.strokeWidth }
            onClick={::this.handleClick}
            className={this.props.className} />
    );
  }

  handleClick() {
    this.props.onClick(...[this.props.data, ...this.props.parentSlices]);
  }
}
