import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { f, storage, database } from '../config/config';

import Header from './../components/header'
import Auth from './../components/auth'

export default function Upload(props) {
  const [avatarSource, setAvatarSource] = useState('')
  const [imageSelected, setImageSelected] = useState(false)
  const [loggedin, setLoggedin] = useState(false)
  const [uri, setUri] = useState('')
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(0)
  const [imageId, setImageId] = useState('')
  const [currentFileType, setCurrentFileType] = useState('')
  const [imageUrl, setImageUrl] = useState('')


  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  }

  const uniqueId = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + '-' + s4() + '-' + s4();

  }


  const launchLibrary = () => {
    ImagePicker.openPicker({
      width: 450,
      height: 350,
      cropping: true
    }).then(image => {
      console.log(image)
      setAvatarSource(image.path)
      setImageId(uniqueId())
      setImageSelected(true)
    });
  }


  const launchCamera = () => {
    ImagePicker.openCamera({
      width: 450,
      height: 350,
      cropping: true,
    }).then(image => {
      setAvatarSource(image.path)
      setImageId(uniqueId())
      setImageSelected(true)
    });
  }

  const uploadPublish = () => {
    if (uploading == false) {
      if (caption != '') {
        uploadImage(avatarSource)
        setUploading(true)
      } else {
        Alert.alert('Please enter a caption...')
      }
    } else {
      console.log('app already uploading a pic')
    }
  }


  const uploadImage = async (uri) => {
    var currentUserId = f.auth().currentUser.uid

    //var re = /(?:\.([^.]+))?$/;
    //var ext = re.exec(uri)[1]
    //setCurrentFileType(ext)

    const response = await fetch(uri);
    const blob = await response.blob()
    var filePath = imageId // + '.' + currentFileType

    var uploadTask = storage.ref('user/' + currentUserId + '/img').child(filePath).put(blob)

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

  const processUpload = (imageUrl) => {
    var currentUserId = f.auth().currentUser.uid;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);

    //Build photo obj
    var photoObj = {
      author: currentUserId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    }
    // Add to main feed
    database.ref('/photos/' + imageId).set(photoObj)

    // set user photos data
    database.ref('/users/' + currentUserId + '/photos/' + imageId).set(photoObj)

    Alert.alert(
      'Photo uploaded',
      'Your new photo is already available',
      [
        { text: 'Ok', onPress: () => { } },
      ],
      { cancelable: false },
    );

    setUploading(false)
    setImageSelected(false)
    setCaption('')
    setImageUrl('')
  }


  useEffect(() => {
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        setLoggedin(true)

      } else {
        setLoggedin(false)
      }
    })

  }, [])


  const handleCancelUpload = () => {
    setAvatarSource('');
    setImageSelected(false)
  }


  return (
    <View style={styles.container} >
      {loggedin == true ? (
        <View style={styles.main}>
          <Header label='Upload' navigation={props.navigation} />
          {imageSelected == true ? (
            <View>
              <TextInput
                editable
                placeholder={'Say something amazing about this photo'}
                maxLength={150}
                multiline={true}
                numberOfLines={4}
                onChangeText={text => setCaption(text)}
                style={styles.photoTitle}
              />
              <Image source={{ uri: avatarSource }} style={styles.uploadAvatar} />
              {uploading == true ? (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ alignSelf: 'center', fontSize: 15, color: 'green' }}>{progress}%</Text>
                  <ActivityIndicator size='small' color='green' />
                </View>
              ) : (
                  <TouchableOpacity
                    onPress={() => uploadPublish()}
                    style={styles.uploadBtn}
                  >
                    <Text style={{ textAlign: 'center', color: 'white' }}>Upload & publish it</Text>
                  </TouchableOpacity>
                )}
              <TouchableOpacity
                onPress={() => handleCancelUpload()}
                style={styles.cancelUpload}
              >
                <Text style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
              <View style={styles.options}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'grey', fontSize: 20, marginBottom: 30 }}>Share your best photo</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => launchCamera()}
                      style={styles.launchCamera}
                    >
                      <Text style={{ fontSize: 18, color: '#fff' }}>Take photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => launchLibrary()}
                      style={styles.launchLibrary}
                    >
                      <Text style={{ fontSize: 18, color: '#fff' }}>Choose photo</Text>
                    </TouchableOpacity>
                  </View>
                  <Image style={{ width: '100%', height: 350 }} source={require('../assets/photo.png')} />
                </View>
              </View>
            )}
        </View>
      ) : (
          <Auth />
        )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  main: {
    flex: 1,
  },

  options: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  uploadAvatar: {
    marginVertical: 10,
    width: '100%',
    height: 275
  },

  notLogged: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  photoTitle: {
    marginVertical: 10,
    height: 100,
    padding: 5,
    borderColor: '#ddd',
    borderWidth: 0.3,
    borderRadius: 3,
    backgroundColor: '#fff',
    color: 'black'
  },

  uploadBtn: {
    alignSelf: 'center',
    width: 170,
    marginHorizontal: 'auto',
    backgroundColor: 'purple',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  launchCamera: {
    marginHorizontal: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 3
  },

  launchLibrary: {
    marginHorizontal: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 3
  },

  cancelUpload: {
    alignSelf: 'center',
    width: 170,
    marginHorizontal: 'auto',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 10,
  }
})
