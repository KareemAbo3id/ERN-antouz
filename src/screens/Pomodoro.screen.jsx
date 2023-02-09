/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View, StyleSheet, Vibration, Platform } from 'react-native';
import { Card, IconButton, Text, ProgressBar } from 'react-native-paper';
import { Flex, Stack, Wrap } from '@react-native-material/core';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Palette } from '../styles/Colors';
import Countdown from '../components/Countdown.component';
// imports ////////////////////////////////

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function sendPushNotification(expoPushToken, titleText, bodyText) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: titleText,
    body: bodyText,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function sendPushNotification2(expoPushToken2, titleText, bodyText) {
  const message = {
    to: expoPushToken2,
    sound: 'default',
    title: titleText,
    body: bodyText,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    return;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({ rootStyle: { flex: 1 } });

const ONE_SECOND_IN_MS = 1000;
const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

// react function /////////////////////////
export default function Pomodoro({
  TypedPlan,
  onResetSession,
  FocusMin,
  breakMin,
  addFocusMin,
  addbreakMin,
}) {
  // local hooks:
  const [progressBar, setProgressBar] = React.useState(1);
  // pomodoro25:
  const [pomodoroWork, setPomodoroWork] = React.useState(false);
  // break5:
  const [breakWork, setBreakWork] = React.useState(false);
  // focus session:
  const [sessionCount, setSessionCount] = React.useState(0);
  // playPause Buttons:
  const [playPause, setPlayPause] = React.useState(true);

  // local handlers:
  const onSessionPlay = () => {
    if (FocusMin > 0 && breakMin > 0) {
      setPomodoroWork(true);
      setPlayPause(false);
    } else if (FocusMin === 0 && breakMin > 0) {
      setBreakWork(true);
      setPlayPause(false);
    }
  };
  const onSessionPause = () => {
    if (FocusMin > 0 && breakMin > 0) {
      setPomodoroWork(false);
      setPlayPause(true);
    } else if (FocusMin === 0 && breakMin > 0) {
      setBreakWork(false);
      setPlayPause(true);
    }
  };

  const onPomodoroEnd = async () => {
    Vibration.vibrate(PATTERN);
    addFocusMin(0);
    setPomodoroWork(false);
    // to Break
    setBreakWork(true);
    await sendPushNotification(
      expoPushToken,
      '👍 Session ended',
      `You now can take a ${breakMin} min break!`
    );
  };

  const onBreakEnd = async () => {
    Vibration.vibrate(PATTERN);
    addbreakMin(0);
    setBreakWork(false);
    setSessionCount(sessionCount + 1);
    // to start again
    setPlayPause(true);
    await sendPushNotification2(
      expoPushToken2,
      '⏲️ Break ended',
      'Get back to focus again!'
    );
  };

  const onReset = () => {
    onResetSession();
    setProgressBar(1);
    setPomodoroWork(false);
    addFocusMin(25);
    setBreakWork(false);
    addbreakMin(5);
    setSessionCount(0);
    setPlayPause(true);
  };

  // notification:
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [expoPushToken2, setExpoPushToken2] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      setExpoPushToken2(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notify) => {
        setNotification(notify);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // local ui:
  return (
    <View style={[{ backgroundColor: Palette.Dark }, styles.rootStyle]}>
      <Flex ph={20} pv={40}>
        <Stack spacing={25}>
          <Flex spacing={2} direction="column" items="center" justify="center">
            <Text variant="headlineMedium">🙌</Text>
            <Text variant="headlineLarge" style={{ color: Palette.Light }}>
              Stay Focused
            </Text>
            <Text variant="bodyMedium" style={{ color: Palette.SecText }}>
              With Pomodoro Technique
            </Text>
          </Flex>
          <Card
            mode="outlined"
            style={{
              backgroundColor: Palette.Darker,
              borderColor: Palette.SecText,
            }}
          >
            <Card.Title
              title={TypedPlan}
              titleStyle={{ color: Palette.Light }}
              titleVariant="titleLarge"
              left={(props) => (
                <Icon {...props} name="bullseye-arrow" color={Palette.Light} />
              )}
            />
            <Card.Content>
              <Wrap ph={10} pv={15} justify="between" items="center">
                <Stack items="center" justify="center" direction="column">
                  <Text variant="titleLarge">🙌</Text>
                  <Text variant="titleMedium" style={{ color: Palette.Light }}>
                    {FocusMin === 0 ? (
                      'Finished'
                    ) : (
                      <Countdown
                        minutes={FocusMin}
                        onProgress={setProgressBar}
                        isPaused={!pomodoroWork}
                        onEnd={onPomodoroEnd}
                      />
                    )}
                  </Text>
                </Stack>
                <Stack items="center" justify="center" direction="column">
                  <Text variant="titleLarge">😌</Text>
                  <Text variant="titleMedium" style={{ color: Palette.Light }}>
                    {breakMin === 0 ? (
                      'Finished'
                    ) : (
                      <Countdown
                        minutes={breakMin}
                        onProgress={setProgressBar}
                        isPaused={!breakWork}
                        onEnd={onBreakEnd}
                      />
                    )}
                  </Text>
                </Stack>
              </Wrap>
            </Card.Content>
            <ProgressBar
              progress={progressBar}
              color={Palette.SecText}
              style={{ backgroundColor: Palette.PrimText, height: 1 }}
            />
            <Flex justify="center" items="center" direction="row">
              {playPause ? (
                <IconButton
                  onPress={onSessionPlay}
                  size={40}
                  style={{
                    backgroundColor: Palette.Darker,
                  }}
                  icon={(props) => (
                    <Icon name="play" {...props} color={Palette.Light} />
                  )}
                />
              ) : (
                <IconButton
                  onPress={onSessionPause}
                  size={40}
                  style={{
                    backgroundColor: Palette.Darker,
                  }}
                  icon={(props) => (
                    <Icon name="pause" {...props} color={Palette.Light} />
                  )}
                />
              )}

              <IconButton
                onPress={onReset}
                size={40}
                style={{
                  backgroundColor: Palette.Darker,
                }}
                icon={(props) => (
                  <Icon name="replay" {...props} color={Palette.Light} />
                )}
              />
            </Flex>
          </Card>
        </Stack>
      </Flex>
    </View>
  );
}
