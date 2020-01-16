import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';


export default function Header(props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ width: 100, flexDirection: 'row', alignItems: 'center' }} onPress={() => props.navigation.goBack()}>
                <Image style={{ marginHorizontal: 10, width: 20, height: 20 }} source={require('../assets/back.png')} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18 }}> {props.label} </Text>
            <Text style={{ marginHorizontal: 10, fontSize: 18, textAlign: 'right', width: 100 }}>?</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 45,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    }
})
