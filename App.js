import React, { useState } from 'react';
import * as Fonts from 'expo-font';
import { AppLoading } from 'expo';
import NavigationController from './navigation/NavigationController';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import countryReducer from './store/reducers/country';
import nurseriesReducer from './store/reducers/nurseries';

const mainReducer = combineReducers({
  auth: authReducer,
  country: countryReducer,
  nurseries: nurseriesReducer,
});

const store = createStore(mainReducer, applyMiddleware(ReduxThunk));
const fetshFonts = () => {
  return Fonts.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'Arial': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });
};
export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetshFonts}
        onFinish={() => setFontLoaded(true)}
      />);
  }
  return (
    <Provider store={store}>
      <NavigationController />
    </Provider>
  );
}
