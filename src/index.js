import React from 'react';
import App from './App';
import loadStats from 'promise?global,stats!../stats.json';

loadStats().then(stats =>
  React.render(<App stats={stats} />, document.getElementById('root'))
);
