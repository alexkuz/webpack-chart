import React, { Component } from 'react';
import Pie from './piechart/Pie';
import Input from 'react-bootstrap/lib/Input';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

function getTreeFromStats(json) {
  const tree = json.modules.reduce((t, module) => {
    var path = module.name.split('/');

    path.reduce((subnode, segment) => {
      var subtree = subnode.children;
      var node = subtree.filter(n => n.label === segment)[0];
      if (!node) {
        node = {
          label: segment,
          value: 0,
          children: []
        };
        subtree.push(node);
      }

      node.value += module.size;

      return node;
    }, {children: t});

    return t;
  }, []);

  function sortTree(subtree) {
    subtree.forEach(node => {
      node.children = sortTree(node.children);
    });

    return subtree.sort((a, b) => b.value - a.value);
  }

  const sum = tree.reduce((s, node) => s + node.value, 0);

  return {
    children: sortTree(tree),
    label: json.publicPath,
    value: sum
  };
}

function findParent(slice, child, parent) {
  if (slice === child) return parent;
  for (let c of child.children || []) {
    const p = findParent(slice, c, child);
    if (p) return p;
  }
}

function getSize(size) {
  if (size > (1 << 20)) {
    return (size / (1 << 20)).toFixed(3) + ' Mb';
  } else if (size > (1 << 10)) {
    return (size / (1 << 10)).toFixed(3) + ' Kb';
  } else {
    return size + ' b';
  }
}

function getGrayColor(level) {
  const gray = Math.min(150 + level * 30, 220);
  return `rgb(${gray}, ${gray}, ${gray})`;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    const tree = getTreeFromStats(props.stats);
    this.state = {
      tree: tree,
      selectedSlice: tree,
      demo: true
    };
  }

  render() {
    const { selectedSlice, demo } = this.state;

    return (
      <div className='container'>
        <Jumbotron className='text-center'>
          <h2 className='text-center'>Webpack Chart</h2>
          <div style={{display: 'inline-block', marginTop: '30px'}}>
            <Input type='file'
                   onChange={::this.handleSelectFile}
                   wrapperClassName='h5'
                   standalone />
          </div>
        </Jumbotron>
        {selectedSlice &&
          <Pie data={selectedSlice}
               radius={200}
               hole={120}
               onClick={::this.handleChartClick}
               getColor={demo ? getGrayColor : undefined}
               getLabel={
                 (slice) => (slice.end - slice.start > 15) &&
                  (slice.level === 0 ?
                   (slice.data.label || 'All') + ' (size: ' + getSize(slice.data.value) + ')' :
                   slice.data.label || slice.data.value)
               } />
        }
      </div>
    );
  }

  handleChartClick(slice) {
    if (slice === this.state.selectedSlice) {
      const parent = findParent(slice, this.state.tree);
      if (parent) {
        this.setState({
          selectedSlice: parent
        });
      }
    } else if (slice && slice.children && slice.children.length) {
      this.setState({
        selectedSlice: slice
      });
    }
  }

  handleSelectFile(e) {
    var file = e.target.files[0];

    var reader = new FileReader();

    reader.onload = ::this.handleFileLoad;

    reader.readAsText(file);
  }

  handleFileLoad(e) {
    const json = JSON.parse(e.target.result);

    const tree = getTreeFromStats(json);

    this.setState({ selectedSlice: tree, tree: tree, demo: false });
  }
}
