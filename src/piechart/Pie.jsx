// http://codepen.io/maydie/details/OVmxZZ

import React, { Component, PropTypes } from 'react';
import getTextCoordinates from './getTextCoordinates';
import createSliceTree from './createSliceTree';
import Ring from './Ring';
import jss from 'jss';
import JssVendorPrefixer from 'jss-vendor-prefixer';
import CSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import getSliceRadius from './getSliceRadius';
import defaultGetColor from './getColor';

jss.use(JssVendorPrefixer);

const sheet = jss.createStyleSheet({
  wrapper: {
    position: 'relative'
  },
  svg: {
    width: '100%',
    height: '100%'
  },
  pieChart: {
    'animation-fill-mode': 'both'
  },
  slice: {

  },
  activeSlice: {
    cursor: 'pointer'
  },
  labels: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    'pointer-events': 'none',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  },
  labelsBox: {
  },
  label: {
    border: '2px solid #FFFFFF',
    position: 'absolute',
    'pointer-events': 'all',
    color: '#FFF',
    'z-index': 1,
    'white-space': 'nowrap',
    transform: 'translate(-50%, -50%)',
    padding: '2px 8px',
    'border-radius': '100px',
    cursor: 'pointer'
  },
  labelsTransition: {
    width: '100vmin',
    height: '100vmin',
    position: 'relative'
  }
}, { link: true }).attach();

jss.createStyleSheet({
  [`.${sheet.classes.labelsBox}-appear`]: {
    opacity: 0
  },
  [`.${sheet.classes.labelsBox}-appear-active`]: {
    opacity: 1,
    transition: 'opacity 1s ease-out'
  },
  [`.${sheet.classes.labelsBox}-enter`]: {
    opacity: 0
  },
  [`.${sheet.classes.labelsBox}-enter-active`]: {
    opacity: 1,
    transition: 'opacity 1s ease-out 0.1s'
  },
  [`.${sheet.classes.labelsBox}-leave`]: {
    opacity: 1
  },
  [`.${sheet.classes.labelsBox}-leave-active`]: {
    opacity: 0,
    transition: 'opacity 0.1s ease-in'
  }
}, { named: false }).attach();

let ringSheet = null;
let ringTransitionSheet = null;

function createRingClasses(props) {
  const depth = props.limit;

  if (ringSheet) {
    ringSheet.detach();
  }

  ringSheet = jss.createStyleSheet({
    ...Array.from({ length: depth + 1 }, (v, k) => k)
      .reduce((rules, idx) => ({
        ...rules,
        ['ring' + idx]: { }
      }), {})
  }).attach();

  const pieChart = props.transitionName;
  const rings = ringSheet.classes;

  if (ringTransitionSheet) {
    ringTransitionSheet.detach();
  }

  ringTransitionSheet = jss.createStyleSheet({
    ...Array.from({ length: depth + 1 }, (v, k) => k)
      .reduce((rules, idx) => ({
        ...rules,
        [`.${pieChart}-appear.${rings['ring' + idx]}`]: {
          transform: 'scale(0.5)'
        },
        [`.${pieChart}-appear-active.${rings['ring' + idx]}`]: {
          transform: 'scale(1)',
          transition: 'transform 0.5s ease-out ' + (idx / 5) + 's'
        },
        [`.${pieChart}-enter.${rings['ring' + idx]}`]: {
          transform: 'scale(0.5)'
        },
        [`.${pieChart}-enter-active.${rings['ring' + idx]}`]: {
          transform: 'scale(1)',
          transition: 'transform 0.5s ease-out ' + (idx / 5) + 's'
        },
        [`.${pieChart}-leave.${rings['ring' + idx]}`]: {
          transform: 'scale(1)'
        },
        [`.${pieChart}-leave-active.${rings['ring' + idx]}`]: {
          transform: 'scale(0.5)',
          transition: 'transform 0.1s ease-in'
        }
      }), {})
  }, { named: false }).attach();
}

export default class Pie extends Component {
  constructor(props) {
    super(props);
    createRingClasses(props);
    this.state = { resetIdx: 0 };
  }

  static propTypes = {
    data: PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.any,
      color: PropTypes.string,
      children: PropTypes.array
    }).isRequired
  }

  static defaultProps = {
    limit: 5,
    labels: true,
    strokeWidth: 3,
    stroke: '#FFFFFF',
    textColor: '#FFFFFF',
    padding: 20,
    factor: 0.7,
    getLabel: s => (s.end - s.start > 15) && (s.data.label || s.data.value),
    transitionName: sheet.classes.pieChart,
    textTransitionName: sheet.classes.labelsBox,
    getRingClassName: l => ringSheet.classes['ring' + l],
    getSliceClassName: (l, i, a) => a ? sheet.classes.activeSlice : sheet.classes.slice,
    className: sheet.classes.wrapper,
    getLabelComponent: (slice, idx, pos, props) => (
      props.getLabel(slice) &&
      <div className={sheet.classes.label}
           style={{
             left: pos.x + '%',
             top: pos.y + '%',
             background: props.getColor(slice.level, idx)
           }}
           key={slice.level + '-' + idx}
           onClick={props.onClick.bind(null, slice.data)}>
        {props.getLabel(slice)}
      </div>
    ),
    getColor: (l, i) => defaultGetColor(l, i),
    getKey: (d) => d.key || (d.label + '-' + d.value)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.limit !== this.props.limit ||
        nextProps.getColor !== this.props.getColor) {
      createRingClasses(nextProps);
      this.setState({ resetIdx: this.state.resetIdx + 1 });
    }
  }

  render() {
    const { hole, radius, onClick, getRingClassName,
            style, data, padding, transitionName, getSliceClassName,
            textTransitionName, getColor, getKey,
            stroke, strokeWidth, className, limit, factor } = this.props;
    const center = getSliceRadius(hole, radius, limit, factor).end + padding;
    const diameter = center * 2;
    const sliceTree = createSliceTree(data, limit);

    return (
      <div className={className}
           style={style}>
        <div className={sheet.classes.labels}>
          <CSSTransitionGroup component='div'
                              className={sheet.classes.labelsTransition}
                              transitionName={textTransitionName}
                              transitionAppear={true}
                              key={this.state.resetIdx}>
            <div key={getKey(data)} className={textTransitionName}>
              {this.renderTexts(sliceTree, center)}
            </div>
          </CSSTransitionGroup>
        </div>
        <svg width='100%'
             height='100%'
             viewBox={'0 0 ' + diameter + ' ' + diameter}
             xmlns="http://www.w3.org/2000/svg"
             version="1.1"
             className={sheet.classes.svg}>
          <g style={{transform: `translate(${center}px, ${center}px)`}}>
            <CSSTransitionGroup component={'g'}
                                transitionName={transitionName}
                                transitionAppear={true}
                                key={this.state.resetIdx}>
              {sliceTree.map((block, idx) =>
                  <Ring className={getRingClassName(block.level)}
                      key={idx + '-' + (getKey(data))}
                      slices={block.slices}
                      level={block.level}
                      {...{hole, radius, center, getColor,
                           factor, getSliceClassName,
                           stroke, strokeWidth, onClick }} />
              )}
            </CSSTransitionGroup>
          </g>
        </svg>
      </div>
    );
  }

  renderTexts(sliceTree, center) {
    const { getLabelComponent, hole, radius, factor } = this.props;

    return [
      for (block of sliceTree)
        for (slice of block.slices)
          getLabelComponent(
            slice,
            block.slices.indexOf(slice),
            getTextCoordinates(slice, hole, radius, center, factor),
            this.props
          )
    ];
  }
}
