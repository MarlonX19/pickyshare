import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, View, StyleSheet, Text, KeyboardAvoidingView, TextInput, Image, ActivityIndicator } from 'react-native';
import { f, auth, storage, database, firebaseConfig } from '../config/config';

import Header from '../components/header';

export default function Comments(props) {
  const [loggedin, setLoggedin] = useState(false)
  const [comment_list, setComment_list] = useState([])
  const [userAvatar, setUserAvatar] = useState('')
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [photoId, setPhotoId] = useState('')
  const [refresh, setRefresh] = useState(false)


  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  }

  const uniqueId = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + '-' + s4() + '-' + s4();

  }

  const pluralCheck = (s) => {
    if (s == 1) {
      return ' ago'
    } else {
      return 's ago'
    }
  }


  const timeConverter = (timestamp) => {
    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000)

    var interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + ' year' + pluralCheck(interval)
    }

    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + ' month' + pluralCheck(interval)
    }

    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + ' day' + pluralCheck(interval)
    }

    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + ' hour' + pluralCheck(interval)
    }

    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + ' minute' + pluralCheck(interval)
    }

    return Math.floor(seconds) + ' second' + pluralCheck(seconds)
  }



  const addCommentToList = (comment_list, data, comment) => {
    let commentObj = data[comment];

    // a longo prazo essa busca não será performática, pois está lendo todos os dados do usuário
    database.ref('users').child(commentObj.author).once('value').then(function (snapshot) {
      const exists = (snapshot.val() !== null)

      if (exists) data = snapshot.val()

      comment_list.push({
        id: comment,
        comment: commentObj.comment,
        posted: timeConverter(commentObj.posted),
        timestamp: commentObj.posted,
        author: data,
        authorId: commentObj.author
      })

      let my_data = [].concat(comment_list).sort((a, b) => a.timestamp < b.timestamp)

      setRefresh(false)
      setLoading(false)
      setComment_list(my_data)

    }).catch(error => console.log('error trying to fetch comments', error))
  }


  const fetchComments = (photoId) => {

    database.ref('comments').child(photoId).orderByChild('posted').on('value', function (snapshot) {
      const exists = (snapshot.val() != null);

      if (exists) {
        let data = snapshot.val()

        var comment_list = [];

        for (var comment in data) {

          addCommentToList(comment_list, data, comment)
        }
      } else {
        setComment_list([])
        setLoading(false)
      }
    })
  }


  const _checkParams = () => {
    var params = props.navigation.state.params;
    if (params) {
      if (params.photoId) {
        setPhotoId(params.photoId)
        fetchComments(params.photoId)
      }
    }

  }

  const getUserAvatar = (userId) => {
    if (userId) {
      database.ref('users').child(userId).once('value').then(function (snapshot) {
        setUserAvatar(snapshot.val().avatar)
        setUserName(snapshot.val().username)
      })
    } else {
      console.log('here')
    }
  }

  const reloadCommentList = () => {
    setComment_list([])
    fetchComments(photoId)
  }


  const postComment = () => {
    if (comment != '') {
      let imageId = photoId;
      let userId = f.auth().currentUser.uid;
      let commentId = uniqueId();
      let dateTime = Date.now();
      let timestamp = Math.floor(dateTime / 1000)

      let commentObj = {
        posted: timestamp,
        author: userId,
        comment: comment,
      }

      database.ref('/comments/' + imageId + '/' + commentId).set(commentObj)
      setComment('')
      reloadCommentList()
    } else {
      alert('Please enter comment')
    }

  }

  const updateComments = () => {
    reloadCommentList()
  }


  useEffect(() => {
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        setLoggedin(true)

        getUserAvatar(user.uid)

      } else {
        setLoggedin(false)
      }
    })

    _checkParams()

  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header label='Comments' navigation={props.navigation} />
      {comment_list.length == 0 ? (
        <View style={{ margin: 15 }}>
          {loading == true ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
              <ActivityIndicator size='small' />
            </View>
          ) : <Text style={{ alignSelf: 'center', fontSize: 24, color: '#98A1A2' }}>No comments</Text>}
        </View>
      ) : (
          <FlatList
            refreshing={refresh}
            onRefresh={updateComments}
            data={comment_list}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: '#eee' }}
            renderItem={({ item, index }) => (
              <View style={{ backgroundColor: '#fff', width: '100%', overflow: 'hidden', justifyContent: 'space-between', borderBottomWidth: 0.5, borderColor: '#ddd' }} key={index}>
                <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 25, width: 25, borderRadius: 50, marginHorizontal: 5 }} source={{ uri: item.author.avatar }} />
                    <TouchableOpacity
                      onPress={() => props.navigation.navigate('User', { userId: item.authorId })}
                    >
                      <Text style={{ color: '#424C4C', fontWeight: 'bold' }}>{item.author.username}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: 10, color: '#98A1A2' }}>{item.posted}</Text>
                </View>
                <View style={{ padding: 5, marginHorizontal: 5 }}>
                  <Text>{item.comment}</Text>
                </View>
              </View>
            )}
          />
        )}
      {
        loggedin == true ? (
          <KeyboardAvoidingView
            behavior='height'
            enabled
            style={{ borderTopWidth: 0.5, borderTopColor: '#ddd', padding: 10, marginBottom: 15 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Image style={{ height: 40, width: 40, borderRadius: 50 }} source={{ uri: userAvatar }} />
              </View>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                placeholder={`Comment as ${userName}`}
                onChangeText={text => setComment(text)}
                value={comment}
                style={{ flex: 5, marginVertical: 5, height: 50, padding: 5, borderColor: 'grey', borderRadius: 3, backgroundColor: '#fff', color: 'black' }}
              />
              <TouchableOpacity
                onPress={() => postComment()}
                style={{ flex: 1 }}
              >
                <Text style={{ color: '#51DB73', textAlign: 'center' }}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopWidth: 0.3, borderColor: '#eee' }}>
              <Text style={{ marginBottom: 10, color: '#98A1A2', fontSize: 19 }}>You're just a visitor!</Text>
              <Text style={{ marginBottom: 10, color: '#98A1A2', fontSize: 16 }}>You need to login or sign up to make a comment!</Text>
              <TouchableOpacity
                style={{ backgroundColor: 'green', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 3 }}
                onPress={() => props.navigation.navigate('Profile')}
              >
                <Text style={{ color: '#fff', alignSelf: 'center' }}>Login/Sign up</Text>
              </TouchableOpacity>
            </View>
          )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 70, paddingTop: 30,
    backgroundColor: '#fff',
    borderColor: 'lightgrey',
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  }
})
