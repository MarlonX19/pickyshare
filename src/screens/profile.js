import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { f, auth, storage, database, firebaseConfig } from '../config/config';
import ImagePicker from 'react-native-image-crop-picker';

import PhotoList from '../components/photolist';
import Header from '../components/header'
import Auth from '../components/auth'

export default function Profile(props) {
  const [loggedin, setLoggedin] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [uri, setUri] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('Say something amazing');
  const [numberOfPosts, setNumberOfPosts] = useState('')
  const [imageSelected, setImageSelected] = useState(false)
  const [imageId, setImageId] = useState(0)
  const [currentFileType, setCurrentFileType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [ progress, setProgress] = useState(0)


  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  }

  const uniqueId = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + '-' + s4() + '-' + s4();

  }

  const findNewAvatar = async () => {

      ImagePicker.openPicker({
        width: 450,
        height: 350,
        cropping: true
      }).then(image => {
        setUri(image.path)
        setImageSelected(true)
        setImageId(uniqueId())
      });
    
  }


  const uploadImage = async (uri) => {

    var currentUserId = f.auth().currentUser.uid

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1]
    setCurrentFileType(ext)
    setUploading(true)

    const response = await fetch(uri);
    const blob = await response.blob()
    var filePath = imageId + '.' + currentFileType

    var uploadTask = storage.ref('user/' + currentUserId + '/img/avatar').child(filePath).put(blob)

    uploadTask.on('state_changed', function (snapshot) {
      var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(progress)
    }, function (error) {
      console.log(error)
    }, function () {
      setProgress(100)
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
       processUpload(downloadURL)
      })

    })

  }


  const fetchUserInfo = (userId) => {
    database.ref('users').child(userId).once('value').then(function (snapshot) {
      const exists = (snapshot.val() !== null)
      let data = []
      if (exists) data = snapshot.val();

      let number = data.photos != null || data.photos != undefined ? data.photos : 0

      setUsername(data.username)
      setName(data.name)
      setAvatar(data.avatar)
      setUserId(userId)
      setBio(data.bio)
      setNumberOfPosts(typeof number == 'object' ? Object.keys(data.photos).length : 0)
      setLoggedin(true)

    })
  }


  const processUpload = (imageUrl) => {
    // set user photos data
    var currentUserId = f.auth().currentUser.uid
    database.ref('/users/' + currentUserId + '/avatar/').set(imageUrl).then(function (snapshot) {
      Alert.alert('Profile updated')
     fetchUserInfo(currentUserId)
    }).catch(error => Alert.alert('Error uploading profile photo'))


  }

  useEffect(() => {
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('here' + user.uid)
       fetchUserInfo(user.uid)

      } else {
        setLoggedin(false)
      }
    })
  }, [])


  function logoutUser() {
    f.auth().signOut()
    setAvatar('')
    setLoggedin(false)
    setUserId('')
    Alert.alert('Logged out' + userId)
  }

  const editProfile = () => {
    setEditingProfile(true)
  }

  const saveProfile = () => {

    if (name != '') {
        database.ref('users').child(userId).child('name').set(name)
    }

    if (username != '') {
        database.ref('users').child(userId).child('username').set(username)
    }

    database.ref('users').child(userId).child('bio').set(bio)

    setEditingProfile(false)

    uploadImage(uri)
}




  return (
    <View style={styles.container}>
      {
        loggedin == true ? (
          <View style={{ flex: 1 }}>
            <Header label='Profile' navigation={props.navigation} />
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', paddingVertical: 10, backgroundColor: '#fff' }}>
              <Image source={{ uri: avatar }} style={{ marginLeft: 10, width: 100, height: 100, borderRadius: 50, borderWidth: 0.4, borderColor: 'purple' }} />
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={{ fontWeight: '900', fontSize: 18 }}>{name}</Text>
                <Text style={{ fontWeight: '300', fontSize: 14 }}>{username}</Text>
                <View>
                  <Text style={{ marginTop: 5, fontSize: 12, color: 'grey' }}>{bio}</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#fff' }}>
              <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold' }}>{numberOfPosts} Posts</Text>
              <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold' }}>0 followers</Text>
              <Text style={{ color: 'grey', fontSize: 12, fontWeight: 'bold' }}>0 following</Text>
            </View>
            {editingProfile == true ? (
              <View style={{ backgroundColor: '#fff', borderTopWidth: 0.2, borderBottomWidth: 0.2, borderColor: '#ddd' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
                    <View>
                      <Text style={{ textAlign: 'left', color: '#ccc' }}>Name</Text>
                      <TextInput
                        editable
                        placeholder={'Enter your name here'}
                        onChangeText={text => setName(text)}
                        value={name}
                        style={{ width: 200, marginVertical: 3, borderBottomWidth: 0.7, borderColor: 'green' }}
                      />
                    </View>
                    <View>
                      <Text style={{ textAlign: 'left', color: '#ccc' }}>Username</Text>
                      <TextInput
                        editable
                        placeholder={'Enter your username here'}
                        onChangeText={text =>setUsername(text)}
                        value={username}
                        style={{ marginTop: 2, width: 200, marginVertical: 3, borderBottomWidth: 0.7, borderColor: 'green' }}
                      />
                    </View>
                    <View>
                      <Text style={{ textAlign: 'left', color: '#ccc' }}>Bio</Text>
                      <TextInput
                        multiline
                        numberOfLines={1}
                        editable
                        placeholder={'Escreva algo incrível sobre si mesmo'}
                        onChangeText={text => setBio(text)}
                        value={bio}
                        style={{ marginTop: 2, width: 200, marginVertical: 3, borderBottomWidth: 0.7, borderColor: 'green', justifyContent: 'flex-start', alignItems: 'flex-start' }}
                      />
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 80, height: 80, borderRadius: 50 }} source={{ uri: uri != '' ? uri : avatar }} />
                    <TouchableOpacity
                      onPress={() => findNewAvatar()}
                    >
                      <Text style={{ color: '#4F97F7' }}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <TouchableOpacity style={{ marginHorizontal: 5, paddingVertical: 5 }} onPress={() => saveProfile()}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#51DB73' }}>Save changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginHorizontal: 5, paddingVertical: 5 }} onPress={() => setEditingProfile(false)}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#F03979' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
                <View style={{ backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.2, borderTopWidth: 0.2, borderColor: '#ddd' }}>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('Upload')}
                    style={{ marginHorizontal: 5, paddingVertical: 5 }}
                  >
                    <Text style={{ textAlign: 'center', color: '#51DB73' }}>Upload photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => editProfile()}
                    style={{ marginHorizontal: 5, paddingVertical: 5 }}
                  >
                    <Text style={{ textAlign: 'center', color: '#4F97F7' }}>Edit profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => logoutUser()}
                    style={{ marginHorizontal: 5, paddingVertical: 5 }}
                  >
                    <Text style={{ textAlign: 'center', color: '#F03979' }}>Log out</Text>
                  </TouchableOpacity>
                </View>
              )}
            <PhotoList navigation={props.navigation} isUser={true} userId={userId} />
          </View>
        ) : (
            <Auth message='Join us' />
          )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1

  }
})
