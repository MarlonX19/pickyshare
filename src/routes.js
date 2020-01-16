import React from 'react';
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
  },

  Upload: {
    screen: Upload,

  },

  Profile: {
    screen: Profile,

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
