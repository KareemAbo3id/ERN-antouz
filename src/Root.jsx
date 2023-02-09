/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Home from './screens/Home.screen';
import Pomodoro from './screens/Pomodoro.screen';
// imports ////////////////////////////////

const styles = StyleSheet.create({ rootStyle: { flex: 1 } });

// react function /////////////////////////
export default function Root() {
  // local hooks:
  const [typedPlan, setTypedPlan] = React.useState(null);
  const [focusPeriod, setfocusPeriod] = React.useState(25);
  const [breakPeriod, setBreakPeriod] = React.useState(5);

  // local ui:
  return (
    <View style={styles.rootStyle}>
      {!typedPlan ? (
        <Home
          addPomodoro={setTypedPlan}
          FocusMin={focusPeriod}
          breakMin={breakPeriod}
          addFocusMin={setfocusPeriod}
          addbreakMin={setBreakPeriod}
        />
      ) : (
        <Pomodoro
          TypedPlan={typedPlan}
          FocusMin={focusPeriod}
          breakMin={breakPeriod}
          addFocusMin={setfocusPeriod}
          addbreakMin={setBreakPeriod}
          onResetSession={() => {
            setTypedPlan(null);
            setfocusPeriod(25);
            setBreakPeriod(5);
          }}
        />
      )}
    </View>
  );
}
