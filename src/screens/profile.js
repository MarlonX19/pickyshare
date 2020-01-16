import React from 'react';
import { View, StyleSheet, Text} from 'react-native';

import Header from './../components/header'

export default function Profile(props) {
  return (
    <View style={styles.container} >
        <Header label='Profile' navigation={props.navigation} />
        <Text>Profile goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1

    }
})
