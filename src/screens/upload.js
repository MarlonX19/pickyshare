import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import Header from './../components/header'
import Auth from './../components/auth'

export default function Upload(props) {
  const [avatarSource, setAvatarSource] = useState('')
  const [imageSelected, setImageSelected] = useState(false)
  const [loggedin, setLoggedin] = useState(false)


  const launch = () => {
    ImagePicker.launchImageLibrary({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 1
    }, (response) => {
      if (response.uri) {
        setAvatarSource(response.uri)
      }

    });
  }


  const launchLibrary = () => {
    ImagePicker.openPicker({
      width: 450,
      height: 350,
      cropping: true
    }).then(image => {
      setAvatarSource(image.path)
    });
  }


  const launchCamera = () => {
    ImagePicker.openCamera({
      width: 450,
      height: 350,
      cropping: true,
    }).then(image => {
      setAvatarSource(image.path)
    });
  }





  return (
    <View style={styles.container} >
      <Header label='Upload' navigation={props.navigation} />
      {loggedin ? true(
        <View style={styles.main}>
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
          <Image source={{ uri: avatarSource }} style={styles.uploadAvatar} />
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
    width: '100%',
    height: 250
  },

  notLogged: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
