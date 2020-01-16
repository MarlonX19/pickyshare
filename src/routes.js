import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Feed from './screens/feed'
import Upload from './screens/upload'
import Profile from './screens/profile'
import UserProfile from './screens/userprofile'
import Comments from './screens/comments'


const TabStack = createBottomTabNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: {
      tabBarIcon: <Image style={{ width: 25, height: 25 }} source={require('./assets/home.png')} />
    }
  },

  Upload: {
    screen: Upload,
    navigationOptions: {
      tabBarIcon: <Image style={{ width: 25, height: 25 }} source={require('./assets/up.png')} />
    }

  },

  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarIcon: <Image style={{ width: 25, height: 25 }} source={require('./assets/user.png')} />
    }
  },
  
})


const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: UserProfile },
    Comments: { screen: Comments },
  },

  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',
  }
)

export default createAppContainer(MainStack);
