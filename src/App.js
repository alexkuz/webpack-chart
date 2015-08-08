import React, { Component } from 'react';
import Pie from './piechart/Pie';
import Input from 'react-bootstrap/lib/Input';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

const DEMO_TREE = {
  value: 1000,
  label: 'DEMO',
  key: 0,
  children: [
    { value: 100, key: 1 },
    { value: 200, key: 2, children: [
      { value: 100, key: 2.1 },
      { value: 20, key: 2.2 },
      { value: 30, key: 2.3, children: [
        { value: 10, key: 2.31 },
        { value: 10, key: 2.32 },
        { value: 10, key: 2.33 }
      ]}
    ]},
    { value: 300, key: 3, children: [
      {value: 300, key: 3.1}
    ]},
    { value: 400, key: 4, children: [
      { value: 100, key: 4.1 },
      { value: 200, key: 4.2 },
      { value: 50, key: 4.3 },
      { value: 50, key: 4.4 }
    ] }
  ]
};

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
  const gray = 150 + level * 30;
  return `rgb(${gray}, ${gray}, ${gray})`;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: DEMO_TREE,
      selectedSlice: DEMO_TREE
    };
  }

  render() {
    const { selectedSlice, tree } = this.state;

    return (
      <div className='container'>
        <Jumbotron>
        <h2 className='text-center'>Webpack Chart</h2>
        <Input type='file' label='Select file: ' onChange={::this.handleSelectFile} />
        </Jumbotron>
        {selectedSlice &&
          <Pie data={selectedSlice}
               radius={200}
               hole={120}
               onClick={::this.handleClick}
               getColor={tree === DEMO_TREE ? getGrayColor : undefined}
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

  handleClick(slice) {
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
    var json = JSON.parse(e.target.result);

    var tree = [];

    tree = json.modules.reduce((t, module) => {
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
    }, tree);

    function sortTree(subtree) {
      subtree.forEach(node => {
        node.children = sortTree(node.children);
      });

      return subtree.sort((a, b) => b.value - a.value);
    }

    const sum = tree.reduce((s, node) => s + node.value, 0);

    tree = {
      children: sortTree(tree),
      label: json.publicPath,
      value: sum
    };

    this.setState({ selectedSlice: tree, tree: tree });
  }
}
