import React from 'react';
import { View, StyleSheet, Text} from 'react-native';

// import { Container } from './styles';

export default function Profile() {
  return (
    <View style={styles.container} >
        <Text>Profile goes here</Text>
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
