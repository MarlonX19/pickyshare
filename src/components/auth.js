import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { f, auth, storage, database } from '../config/config'
import Divider from 'react-native-divider';

// import { Container } from './styles';

export default function Auth() {
    const [authStep, setAuthStep] = useState(0)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [checking, setChecking] = useState(false)



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
        setChecking(true)
        if (email != '' && pass != '') {
            try {
                let user = await auth.signInWithEmailAndPassword(email, pass)
                setChecking(false)
            } catch (error) {
                setChecking(false)
                Alert.alert(error.message)
            }
        } else {
            setChecking(false)
            Alert.alert('Email or password are empty')
        }

    }


    const signUp = async () => {
        setChecking(true)
        if (email != '' && pass != '') {
            try {
                let user = await auth.createUserWithEmailAndPassword(email, pass)
                    .then((userObj) => createUserObj(userObj.user, email))
                    .catch((err) => alert(err))
                    setChecking(false)
            } catch (err) {
                setChecking(false)
                Alert.alert(err)
            }
        } else {
            setChecking(false)
            Alert.alert('Email or password are empty')
        }

    }



    return (
        <View style={styles.container}>
            {authStep == 0 ? (
                <View style={styles.options}>
                    <View>
                        <Image style={{ width: 350, height: 300 }} source={require('../assets/create.png')} />
                    </View>
                    <TouchableOpacity
                        onPress={() => setAuthStep(1)}
                    >
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                    <Divider color='grey' orientation='center'>or</Divider>
                    <TouchableOpacity
                        onPress={() => setAuthStep(2)}
                    >
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                    <View style={{ flex: 1, marginHorizontal: 20, marginVertical: 20, alignItems: 'center' }}>
                        {authStep == 1 ? (
                            <View>
                                <Text style={styles.emailOption}>Login</Text>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    editable
                                    keyboardType='email-address'
                                    placeholder='Enter your email address here'
                                    autoCapitalize='none'
                                    onChangeText={text => setEmail(text)}
                                    value={email}
                                    style={styles.Input}
                                />
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    editable
                                    secureTextEntry
                                    placeholder='Enter your password here'
                                    autoCapitalize='none'
                                    onChangeText={text => setPass(text)}
                                    value={pass}
                                    style={styles.Input}
                                />
                                <TouchableOpacity
                                    disabled={checking}
                                    style={[styles.loginBtn, { backgroundColor: checking == true ? '#ddd' : 'green'}]}
                                    onPress={() => login()}
                                >
                                    <Text style={{ color: '#fff', alignSelf: 'center' }}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelLogin}
                                    onPress={() => setAuthStep(0)}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>Cancel</Text>
                                </TouchableOpacity>
                                <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={require('../assets/join.png')} />
                            </View>
                        ) : (
                                <View style={{ flex: 1, marginHorizontal: 20, marginVertical: 20, alignItems: 'center' }}>
                                    <View>
                                        <Text style={styles.emailOption}>Sign up</Text>
                                        <Text style={styles.label}>Email</Text>
                                        <TextInput
                                            editable
                                            keyboardType='email-address'
                                            placeholder='Enter your email address here'
                                            autoCapitalize='none'
                                            onChangeText={text => setEmail(text)}
                                            value={email}
                                            style={{ width: 250, marginVertical: 10, padding: 5, borderBottomWidth: 0.3, borderColor: 'grey', borderRadius: 3 }}
                                        />
                                        <Text style={styles.label}>Password</Text>
                                        <TextInput
                                            editable
                                            secureTextEntry
                                            placeholder='Enter your password here'
                                            autoCapitalize='none'
                                            onChangeText={text => setPass(text)}
                                            value={pass}
                                            style={styles.Input}
                                        />
                                        <TouchableOpacity
                                            disabled={checking}
                                            style={[styles.signupBtn, { backgroundColor: checking == true ? '#ddd' : 'blue'}]}
                                            onPress={() => signUp()}
                                        >
                                            <Text style={{ color: '#fff', alignSelf: 'center' }}>Sign up</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.cancelSignup}
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
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
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
    },

    emailOption: {
        fontSize: 24,
        margin: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#535A55',
        alignSelf: 'center'
    },

    label: {
        marginLeft: 2,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#ccc'
    },

    Input: {
        width: 250,
        marginVertical: 10,
        padding: 5,
        borderBottomWidth: 0.3,
        borderColor: 'grey',
        borderRadius: 3
    },

    loginBtn: {
        backgroundColor: 'green',
        paddingVertical: 10,
        marginVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 3
    },

    cancelLogin: {
        borderWidth: 0.4,
        paddingVertical: 5,
        marginVertical: 2,
        marginBottom: 10,
        borderColor: 'green',
        borderRadius: 3
    },

    signupBtn: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        marginVertical: 2,
        paddingHorizontal: 20,
        borderRadius: 3
    },

    cancelSignup: {
        borderWidth: 0.4,
        paddingVertical: 5,
        marginVertical: 2,
        marginBottom: 10,
        borderColor: 'green',
        borderRadius: 3
    }

})
