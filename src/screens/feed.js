import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

// import { Container } from './styles';

export default function Feed() {
  return (
    <View style={styles.container} >
        <Text>Feed goes here haha</Text>
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
