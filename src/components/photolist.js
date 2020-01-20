import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet, FlatList, DrawerLayoutAndroidBase, ActivityIndicator, Alert } from 'react-native'
import { f, auth, storage, database } from '../config/config'

export default function PhotoList(props) {
    const [photo_feed, setPhoto_feed] = useState([])
    const [userAvatar, setUserAvatar] = useState('mark')
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [empty, setEmpty] = useState(false)
    const [isUser, setIsUser] = useState(false)


    const pluralCheck = (s) => {
        if (s == 1) {
            return 'ago'
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

    const addToFlatlist = (feed, data, photo) => {
        var photoObj = data[photo]

        let userAvatar = 'https://i.pravatar.cc/200'
        database.ref('users').child(photoObj.author).child('avatar').once('value').then(function (snapshot) {
            userAvatar = snapshot.val()
        }).catch(error => console.log(error))

        database.ref('users').child(photoObj.author).child('username').once('value').then(function (snapshot) {

            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();

            feed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: timeConverter(photoObj.posted),
                timestamp: photoObj.posted,
                author: data,
                authorId: photoObj.author,
                userAvatar: userAvatar
            })

            var my_data = [].concat(feed).sort((a, b) => a.timestamp < b.timestamp)

            setRefresh(false)
            setLoading(false)
            setPhoto_feed(my_data)

        }).catch(err => console.log(err))
    }


    const loadFeed = (userId = '') => {
        setRefresh(false)
        
        var loadRef = database.ref('photos')

        if (userId != '') {
            loadRef = database.ref('users').child(userId).child('photos')
        }

        loadRef.orderByChild('posted').once('value')
            .then(function (snapshot) {
                const exists = (snapshot.val() !== null);
                if (exists) {
                    let data = snapshot.val();

                    var feed = [];
                    setEmpty(false)
                    for (var photo in data) {
                        addToFlatlist(feed, data, photo)
                    }
                } else {
                    setEmpty(true)
                }
            }).catch(err => console.log(err))
    }

    const loadNew = () => {

        if (userId != '' && isUser == true) {
           loadFeed(userId)
        } else {
            loadFeed()
        }

    }

    const deletePhoto = (userId, imageId) => {
        var storageRef = storage.ref()
        var desertRef = storageRef.child('user/' + userId + '/img/' + imageId + '.')
        desertRef.delete().then(function () {
            let removePhotoFromUsers = database.ref('users/' + userId + '/photos/' + imageId)
            removePhotoFromUsers.remove()

            let removePhotoFromPhotos = database.ref('photos/' + imageId)
            removePhotoFromPhotos.remove()

            let removePhotoFromComments = database.ref('comments/' + imageId)
            removePhotoFromComments.remove()

            Alert.alert('Photo Deleted')
            loadNew()

        }).catch(function (error) {
            alert(error.message)
        });
    }



    const handleDelete = (userId, imageId) => {
        Alert.alert(
            'Delete photo',
            'Are you sure?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed')
              },
              {text: 'Yes', onPress: () => deletePhoto(userId, imageId)},
            ],
            {cancelable: false},
          );
    }


    useEffect(() => {
        let { isUser, userId } = props;
        console.log('aqui ' + userId)
        console.log('eh user ' + isUser)
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('caiu aqui')
                setUserId(user.uid)
            }
        })

        if (isUser == true) {
            loadFeed(userId)
            setUserId(userId)
            setIsUser(true)
        } else {
            console.log('carreda tudo')
            loadFeed()
        }

    }, [])

    return (
        <View style={{ flex: 1 }}>
            {
                loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {empty == true ? (
                            <Text style={{ fontSize: 18, color: 'grey' }}>No photos found</Text>
                        ) : (
                                <ActivityIndicator size='large' />
                            )}
                    </View>
                ) :
                    (
                        <FlatList
                            refreshing={refresh}
                            onRefresh={loadNew}
                            data={photo_feed}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}
                            renderItem={({ item, index }) => (
                                <View key={index} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={() => props.navigation.navigate('User', { userId: item.authorId, visitorId: visitorId })}
                                            >
                                                <Image
                                                    source={{ uri: item.userAvatar }}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        marginHorizontal: 10,
                                                        borderRadius: 50
                                                    }} />
                                            </TouchableOpacity>
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() => props.navigation.navigate('User', { userId: item.authorId, visitorId: visitorId })}
                                                >
                                                    <Text style={{ color: '#424C4C', fontWeight: 'bold' }}>{item.author}</Text>
                                                </TouchableOpacity>
                                                <Text style={{ color: '#98A1A2', fontSize: 10 }}>{item.posted}</Text>
                                            </View>
                                        </View>
                                        {userId == item.authorId ? (
                                            <TouchableOpacity
                                                style={{ marginHorizontal: 10 }}
                                                onPress={() => handleDelete(item.authorId, item.id)}
                                            >
                                                <Text style={{ paddingLeft: 10, fontSize: 18, color: 'grey' }}>x</Text>
                                            </TouchableOpacity>
                                        ) : <View></View>}
                                    </View>
                                    <View>
                                        <Image
                                            source={{ uri: item.url }}
                                            style={{ resizeMode: 'cover', width: '100%', height: 310 }}
                                        />
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => props.navigation.navigate('User', { userId: item.authorId })}
                                            >
                                                <Text style={{ color: '#424C4C', fontWeight: 'bold' }}>{item.author}</Text>
                                            </TouchableOpacity>
                                            <Text style={{ marginLeft: 5 }}>{item.caption}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate('Comments', { photoId: item.id })}
                                        >
                                            <Text style={{ marginHorizontal: 10, color: '#98A1A2', marginTop: 10, textAlign: 'left' }}>View all comments</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
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
        justifyContent: 'center',
        alignItems: 'center'
    },

    card: {
        width: '100%',
        overflow: 'hidden',
        marginBottom: 5,
        justifyContent: 'space-between',
        borderBottomWidth: 0.1,
        borderColor: 'grey',
        backgroundColor: 'white'

    },

    cardHeader: {
        padding: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

