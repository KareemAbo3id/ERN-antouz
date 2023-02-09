/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Snackbar, Text } from 'react-native-paper';
import { Palette } from '../styles/Colors';
// imports ////////////////////////////////

// react function /////////////////////////
export default function CSnackbar({ show, onDismiss, message }) {
  // local hooks:

  // local handlers:

  // local ui:
  return (
    <Snackbar
      elevation={0}
      visible={show}
      onDismiss={onDismiss}
      onIconPress={onDismiss}
      style={{ backgroundColor: Palette.Light }}
      duration={2500}
    >
      <Text style={{ color: Palette.Dark }}>👉 {message}</Text>
    </Snackbar>
  );
}
