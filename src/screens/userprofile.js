import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Header from './../components/header'

export default function UserProfile() {
  return (
    <View style={styles.container} >
        <Header label='User profile' navigation={props.navigation} />
        <Text>UserProfile goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1

    }
})
