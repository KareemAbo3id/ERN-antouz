/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StyleSheet, Keyboard, View, Platform } from 'react-native';
import { IconButton, Surface, Text, TextInput } from 'react-native-paper';
import { Button, Flex, HStack, Stack, Wrap } from '@react-native-material/core';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import CSnackbar from '../components/Snackbar.component';
import { Palette } from '../styles/Colors';
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

// react function /////////////////////////
export default function Home({
  addPomodoro,
  FocusMin,
  breakMin,
  addFocusMin,
  addbreakMin,
}) {
  // local hooks:
  const [task, setTask] = React.useState(null);
  // plus and minus buttons:
  const [minusFocusDis, setMinusFocusDis] = React.useState(false);
  const [plusFocusDis, setPlusFocusDis] = React.useState(false);
  const [minusBreakDis, setMinusBreakDis] = React.useState(false);
  const [plusBreakDis, setPlusBreakDis] = React.useState(false);
  // snackbar hooks:
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const onToggleSnackBar = () => setShowSnackbar(!showSnackbar);
  const onDismissSnackBar = () => setShowSnackbar(false);

  // local handlers:
  const minusFocusFn = () => {
    if (FocusMin === 5) {
      setMinusFocusDis(true);
    } else {
      addFocusMin(FocusMin - 5);
      setPlusFocusDis(false);
    }
  };
  const plusFocusFn = () => {
    if (FocusMin === 120) {
      setPlusFocusDis(true);
    } else {
      addFocusMin(FocusMin + 5);
      setMinusFocusDis(false);
    }
  };
  const minusBreakFn = () => {
    if (breakMin === 5) {
      setMinusBreakDis(true);
    } else {
      addbreakMin(breakMin - 5);
      setPlusBreakDis(false);
    }
  };
  const plusBreakFn = () => {
    if (breakMin === 120) {
      setPlusBreakDis(true);
    } else {
      addbreakMin(breakMin + 5);
      setMinusBreakDis(false);
    }
  };

  const focusButtonHandler = async () => {
    if (!task || task === '') {
      onToggleSnackBar();
      setSnackbarMessage('Please type your task.');
    } else {
      await sendPushNotification(
        expoPushToken,
        '🙌 Stay Focused',
        `Your task "${task}" has been started.`
      );
      addPomodoro(task);
      Keyboard.dismiss();
    }
  };

  // notification:
  const [expoPushToken, setExpoPushToken] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
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
          <TextInput
            placeholder="Tell me your task..."
            mode="outlined"
            onChangeText={setTask}
            textColor={Palette.Light}
            placeholderTextColor={Palette.SecText}
            cursorColor={Palette.PrimText}
            outlineStyle={{ borderColor: Palette.SecText }}
            style={styles.TextInputStyle}
          />
          <Surface
            style={{
              backgroundColor: Palette.Darker,
              borderColor: Palette.SecText,
              borderRadius: 4,
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <HStack spacing={5} justify="between" items="center">
              <Text
                variant="titleSmall"
                style={{ color: Palette.SecText, textTransform: 'capitalize' }}
              >
                Focus period
              </Text>
              <IconButton
                disabled={minusFocusDis}
                icon="minus"
                iconColor={Palette.Light}
                onPress={minusFocusFn}
              />
              <Flex
                justify="center"
                items="center"
                direction="column"
                spacing={1}
              >
                <Text variant="headlineSmall" style={{ color: Palette.Light }}>
                  {FocusMin.toLocaleString().length === 1
                    ? `0${FocusMin}`
                    : FocusMin}
                </Text>
                <Text variant="labelMedium" style={{ color: Palette.Light }}>
                  min
                </Text>
              </Flex>
              <IconButton
                disabled={plusFocusDis}
                icon="plus"
                iconColor={Palette.Light}
                onPress={plusFocusFn}
              />
            </HStack>
          </Surface>
          <Surface
            style={{
              backgroundColor: Palette.Darker,
              borderColor: Palette.SecText,
              borderRadius: 4,
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <HStack spacing={5} justify="between" items="center">
              <Text
                variant="titleSmall"
                style={{ color: Palette.SecText, textTransform: 'capitalize' }}
              >
                Break period
              </Text>
              <IconButton
                disabled={minusBreakDis}
                icon="minus"
                iconColor={Palette.Light}
                onPress={minusBreakFn}
              />
              <Flex
                justify="center"
                items="center"
                direction="column"
                spacing={1}
              >
                <Text variant="headlineSmall" style={{ color: Palette.Light }}>
                  {breakMin.toLocaleString().length === 1
                    ? `0${breakMin}`
                    : breakMin}
                </Text>
                <Text variant="labelMedium" style={{ color: Palette.Light }}>
                  min
                </Text>
              </Flex>
              <IconButton
                disabled={plusBreakDis}
                icon="plus"
                iconColor={Palette.Light}
                onPress={plusBreakFn}
              />
            </HStack>
          </Surface>
        </Stack>
      </Flex>
      <Wrap justify="center" items="center">
        <Button
          title="start"
          color={Palette.Light}
          elevation={2}
          titleStyle={{ fontSize: 18 }}
          onPress={() => {
            focusButtonHandler();
          }}
        />
      </Wrap>
      <CSnackbar
        show={showSnackbar}
        onDismiss={onDismissSnackBar}
        message={snackbarMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  TextInputStyle: {
    backgroundColor: Palette.Darker,
    paddingVertical: 5,
  },
  rootStyle: { flex: 1 },
});
