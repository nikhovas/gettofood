import React from 'react';
import './App.css';


import Main from './components/Main';
import { Provider } from 'react-redux';
import store from './store/store';

// import initStore from './store/store';

function App() {
  // localStorage.setItem('asdf', "asdf")

  return (
    <Provider store={store}>
    <div>
    
    <Main />
  </div>
  </Provider>
  );
}

export default App;
