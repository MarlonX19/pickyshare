import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Header from './../components/header'
import PhotoList from '../components/photolist'

export default function Feed(props) {
  return (
    <View style={styles.container} >
      <Header label='Feed' navigation={props.navigation} />
      <PhotoList navigation={props.navigation} isUser={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  }
})
