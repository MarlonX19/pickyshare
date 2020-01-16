import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import Header from './../components/header'

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default function Upload(props) {
  const [avatarSource, setAvatarSource] = useState('')

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




  return (
    <View style={styles.container} >
      <Header label='Upload' navigation={props.navigation} />
      <View style={styles.main}>
        <TouchableOpacity
          onPress={() => launch()}
        >
          <Text>Upload goes here</Text>
        </TouchableOpacity>
        <Image source={{ uri: avatarSource }} style={styles.uploadAvatar} />
      </View>
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

  uploadAvatar: {
    width: '100%',
    height: 250
  }
})
