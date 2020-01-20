import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { f, auth, storage, database, firebaseConfig } from '../config/config';

import Header from './../components/header'
import Auth from './../components/auth'

export default function Upload(props) {
  const [avatarSource, setAvatarSource] = useState('file:///storage/emulated/0/Pictures/7f8737ba-c4b9-4c83-b821-38eb36bbaf4f.jpg')
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
      } else {
        alert('Please enter a caption...')
      }
    } else {
      console.log('app already uploading a pic')
    }
  }


  const uploadImage = async (uri) => {
    console.log(uri)
    var currentUserId = f.auth().currentUser.uid

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1]
    setCurrentFileType(ext)

    const response = await fetch(uri);
    const blob = await response.blob()
    var filePath = imageId + '.' + currentFileType

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



  return (
    <View style={styles.container} >
      <Header label='Upload' navigation={props.navigation} />
      {loggedin == true ? (
        <View style={styles.main}>
          {imageSelected == true ? (
            <View>
              <TextInput
                editable
                placeholder={'Say something amazing about this photo'}
                maxLength={150}
                multiline={true}
                numberOfLines={4}
                onChangeText={text => setCaption(text)}
                style={{ marginVertical: 10, height: 100, padding: 5, borderColor: '#ddd', borderWidth: 0.3, borderRadius: 3, backgroundColor: '#fff', color: 'black' }}
              />
              <Image source={{ uri: avatarSource }} style={styles.uploadAvatar} />
              <TouchableOpacity
                onPress={() => uploadPublish()}
                style={{ alignSelf: 'center', width: 170, marginHorizontal: 'auto', backgroundColor: 'purple', borderRadius: 3, paddingVertical: 10, paddingHorizontal: 10, }}
              >
                <Text style={{ textAlign: 'center', color: 'white' }}>Upload & publish it</Text>
              </TouchableOpacity>
            </View>
          ) : (
              <View style={styles.options}>
                <TouchableOpacity
                  onPress={() => launchCamera()}
                  style={{ marginHorizontal: 10 }}
                >
                  <Text>Take</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => launchLibrary()}
                  style={{ marginHorizontal: 10 }}
                >
                  <Text>Choose</Text>
                </TouchableOpacity>
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
    flex: 1

  },

  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  uploadAvatar: {
    marginTop: 10,
    width: 400,
    height: 275
  },

  notLogged: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
