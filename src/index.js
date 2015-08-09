import React from 'react';
import App from './App';
import loadStats from 'promise?global,stats!../stats.json';

loadStats().then(stats => {
  try {
    React.render(<App stats={stats} />, document.getElementById('root'));
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}
);
