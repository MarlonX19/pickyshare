import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { f, auth, storage, database, firebaseConfig } from '../config/config';

import Header from '../components/header'
import PhotoList from '../components/photolist'

export default function UserProfile(props) {
  const [loaded, setLoaded] = useState(false)
  const [userId, setUserId] = useState('')
  const [bio, setBio] = useState('')
  const [numberOfPosts, setNumberOfPosts] = useState('')
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')


  const fetchUserInfo = (userId) => {
    database.ref('users').child(userId).child('username').once('value')
      .then(function (snapshot) {
        const exists = (snapshot.val() !== null);
        var data;
        if (exists) data = snapshot.val();
        setUsername(data)
      }).catch(error => console.log(error))


    database.ref('users').child(userId).child('photos').once('value')
      .then(function (snapshot) {
        const exists = (snapshot.val() !== null);
        var data;
        if (exists) data = snapshot.val();

        if (typeof data == 'object') {
          setNumberOfPosts(data != null || data != undefined ? Object.keys(data).length : 0)

        } else {
          setNumberOfPosts(0)
        }

      }).catch(error => console.log(error))

    database.ref('users').child(userId).child('name').once('value')
      .then(function (snapshot) {
        const exists = (snapshot.val() !== null);
        var data;
        if (exists) data = snapshot.val();

        setName(data)

      }).catch(error => console.log(error))

    database.ref('users').child(userId).child('avatar').once('value')
      .then(function (snapshot) {
        const exists = (snapshot.val() !== null);
        var data;
        if (exists) data = snapshot.val();

        setAvatar(data)

      }).catch(error => alert(error))

    database.ref('users').child(userId).child('bio').once('value')
      .then(function (snapshot) {
        const exists = (snapshot.val() !== null);
        var data;
        if (exists) data = snapshot.val();

        setBio(data)
        setLoaded(true)

      }).catch(error => console.log(error))
     
  }


  const checkParams = () => {
    let params = props.navigation.state.params;
    if (params) {
      if (params.userId) {
        setUserId(params.userId)
        fetchUserInfo(params.userId)
      }
    }
  }

  useEffect(() => {
    checkParams()
  }, [])


  return (
    <View style={styles.container}>
      {loaded == false ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 28, color: '#ddd' }}>Loading...!</Text>
        </View>
      ) : (
          <View style={{ flex: 1 }}>
            <Header label={`${name}'s profile`} navigation={props.navigation} />
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderTopWidth: 0.2, borderColor: '#ddd', paddingVertical: 10 }}>
              <Image source={{ uri: avatar }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50, borderWidth: 0.4, borderColor: 'purple' }} />
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={{ fontWeight: '900', fontSize: 18 }}>{name}</Text>
                <Text style={{ fontWeight: '300', fontSize: 14 }}>{username}</Text>
                <Text style={{ marginTop: 5, fontSize: 12, color: 'grey' }}>{bio}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#fff', borderBottomWidth: 0.3, borderColor: '#eee' }}>
              <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold' }}>{numberOfPosts} Posts</Text>
              <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold' }}>0 followers</Text>
              <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold' }}>0 following</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' }}>
              <PhotoList navigation={props.navigation} isUser={true} userId={userId} />
            </View>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  }
})
