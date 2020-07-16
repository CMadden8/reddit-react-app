import React from 'react';
import './App.scss';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { SubredditPostListing } from './components/subreddit-post-listing';

library.add(fab, faCheckSquare, faCoffee);

const subredditTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#0076a3',
    },
    secondary: {
      main: '#DDDDDD',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={subredditTheme}>
      <div className="App">
        <CssBaseline />
        <SubredditPostListing />
      </div>
    </ThemeProvider>
  );
}

export default App;
