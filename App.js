/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-curly-newline */
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { name as appName } from './app.json';
import Root from './src/Root';
import { Palette } from './src/styles/Colors';
// imports ////////////////////////////////

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#395B64',
    secondary: '#798380',
  },
};

// react function /////////////////////////
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={Styles.SAVStyleForAndroid}>
        <StatusBar translucent backgroundColor={Palette.Darker} />
        <Root />
      </SafeAreaView>
    </PaperProvider>
  );
}

// local styles:
const Styles = StyleSheet.create({
  SAVStyleForAndroid: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

AppRegistry.registerComponent(appName, () => App);
