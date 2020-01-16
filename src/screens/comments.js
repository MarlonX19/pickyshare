import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

// import { Container } from './styles';

export default function Comments() {
  return (
    <View style={styles.container} >
        <Text>Comments goes here haha</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    }
})
