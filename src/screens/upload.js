import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Header from './../components/header'

export default function Upload(props) {
  return (
    <View style={styles.container} >
         <Header label='Upload' navigation={props.navigation} />
        <Text>Upload goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1

    }
})
