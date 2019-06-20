import React from 'react';
import {createStackNavigator} from 'react-navigation';
import Home from './Home';
import Detail from './Detail';

export default createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Home',
    },
  },
  Detail: {
    screen: Detail,
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.item.name,
    }),
  },
},{
  initialRouteName: 'Home',
});
