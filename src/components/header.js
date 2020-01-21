import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';


export default function Header(props) {
    return (
        <View style={styles.container}>
            {props.isFeed == true ? (
                <>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('Upload')}
                    >
                        <Image style={{ width: 30, height: 30, marginLeft: 10 }} source={require('../assets/camera2.png')} />
                    </TouchableOpacity>
                </>
            ) : (
                    <TouchableOpacity style={{ width: 100, flexDirection: 'row', alignItems: 'center' }} onPress={() => props.navigation.goBack()}>
                        <Image style={{ marginHorizontal: 10, width: 20, height: 20 }} source={require('../assets/back.png')} />
                    </TouchableOpacity>
                )}
            <Text style={{ fontSize: 18 }}> {props.label} </Text>
            {props.isFeed == true ? (
                <Image style={{ width: 30, height: 30, marginRight: 10 }} source={require('../assets/send.png')} />
            ) : (
                    <Text style={{ marginHorizontal: 10, fontSize: 18, textAlign: 'right', width: 100 }}>?</Text>
                )}
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
