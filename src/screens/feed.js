import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Header from './../components/header'

export default function Feed(props) {
  return (
    <View style={styles.container} >
      <Header label='Feed' navigation={props.navigation} />
      <Text>Feed goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  }
})
