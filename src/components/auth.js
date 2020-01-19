import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { f, auth, storage, database } from '../config/config'

// import { Container } from './styles';

export default function Auth() {
    const [authStep, setAuthStep] = useState(0)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')



    const createUserObj = (userObj, email) => {

        var uObj = {
            name: 'Enter name',
            username: 'name',
            avatar: 'http://www.gravatar.com/avatar',
            email: email
        }

        database.ref('users').child(userObj.uid).set(uObj)
    }


    const login = async () => {
        if (email != '' && pass != '') {
            try {
                let user = await auth.signInWithEmailAndPassword(email, pass)
            } catch (err) {
                alert(err)
            }
        } else {
            Alert.alert('Email or password are empty')
        }

    }


    const signUp = async () => {
        if (email != '' && pass != '') {
            try {
                let user = await auth.createUserWithEmailAndPassword(email, pass)
                    .then((userObj) => createUserObj(userObj.user, email))
                    .catch((err) => alert(err))
            } catch (err) {
                alert(err)
            }
        } else {
            alert('Email or password are empty')
        }

    }



    return (
        <View style={styles.container}>
            {authStep == 0 ? (
                <View style={styles.options}>
                    <Text style={{ fontSize: 18, color: 'grey'}}>You're not logged in</Text>
                    <View>
                        <Image style={{ width: 350, height: 300 }} source={require('../assets/create.png')} />
                    </View>
                    <TouchableOpacity
                        onPress={() => setAuthStep(1)}
                    >
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'grey' }}>---- or ----</Text>
                    <TouchableOpacity
                        onPress={() => setAuthStep(2)}
                    >
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                    <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                        {authStep == 1 ? (
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#ccc', alignSelf: 'center' }}>Login</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ccc' }}>Email</Text>
                                <TextInput
                                    editable
                                    keyboardType='email-address'
                                    placeholder='Enter your email address here'
                                    autoCapitalize='none'
                                    onChangeText={text => setEmail(text)}
                                    value={email}
                                    style={{ width: 250, marginVertical: 10, padding: 5, borderBottomWidth: 0.3, borderColor: 'grey', borderRadius: 3 }}
                                />
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ccc' }}>Password</Text>
                                <TextInput
                                    editable
                                    secureTextEntry
                                    placeholder='Enter your password here'
                                    autoCapitalize='none'
                                    onChangeText={text => setPass(text)}
                                    value={pass}
                                    style={{ width: 250, marginVertical: 10, padding: 5, borderBottomWidth: 0.3, borderColor: 'grey', borderRadius: 3 }}
                                />
                                <TouchableOpacity
                                    style={{ backgroundColor: 'green', paddingVertical: 10, marginVertical: 2, paddingHorizontal: 20, borderRadius: 3 }}
                                    onPress={() => login()}
                                >
                                    <Text style={{ color: '#fff', alignSelf: 'center' }}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ borderWidth: 0.4, paddingVertical: 5, marginVertical: 2, marginBottom: 10, borderColor: 'green', borderRadius: 3 }}
                                    onPress={() => setAuthStep(0)}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>Cancel</Text>
                                </TouchableOpacity>
                                <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={require('../assets/join.png')} />
                            </View>
                        ) : (
                                <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#ccc', alignSelf: 'center' }}>Sign up</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ccc' }}>Email</Text>
                                        <TextInput
                                            editable
                                            keyboardType='email-address'
                                            placeholder='Enter your email address here'
                                            autoCapitalize='none'
                                            onChangeText={text => setEmail(text)}
                                            value={email}
                                            style={{ width: 250, marginVertical: 10, padding: 5, borderBottomWidth: 0.3, borderColor: 'grey', borderRadius: 3 }}
                                        />
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ccc' }}>Password</Text>
                                        <TextInput
                                            editable
                                            secureTextEntry
                                            placeholder='Enter your password here'
                                            autoCapitalize='none'
                                            onChangeText={text => setPass(text)}
                                            value={pass}
                                            style={{ width: 250, marginVertical: 10, padding: 5, borderBottomWidth: 0.3, borderColor: 'grey', borderRadius: 3 }}
                                        />
                                        <TouchableOpacity
                                            style={{ backgroundColor: 'blue', paddingVertical: 10, marginVertical: 2, paddingHorizontal: 20, borderRadius: 3 }}
                                            onPress={() => signUp()}
                                        >
                                            <Text style={{ color: '#fff', alignSelf: 'center' }}>Sign up</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ borderWidth: 0.4, paddingVertical: 5, marginVertical: 2, marginBottom: 10, borderColor: 'green', borderRadius: 3 }}
                                            onPress={() => setAuthStep(0)}
                                        >
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'blue' }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={require('../assets/join.png')} />
                                    </View>
                                </View>
                            )}

                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    options: {
        marginVertical: 20,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    loginText: {
        fontSize: 20,
        padding: 10,
        color: 'green',
        fontWeight: 'bold'
    },

    signUpText: {
        fontSize: 20,
        padding: 10,
        color: 'blue',
        fontWeight: 'bold'
    }
})
