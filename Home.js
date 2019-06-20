/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  AppState,
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  state = {
    items: [],
    refreshing: false,
    text: '',
  }
  page=0;

  onFetchRepositories(refreshing = false){
    const newPage = refreshing ? 1 : this.page + 1;
    this.setState({refreshing});
    // https://api.github.com/search/repositories?q=react
    fetch("https://api.github.com/search/repositories?q="+this.state.text+"&page="+newPage)
    .then(response => response.json())
    .then(({ items }) => {
      this.page = newPage;
      if(refreshing){
        this.setState({ items, refreshing: false });
        console.log({items});
      }else{
        this.setState({items: [...this.state.items, ...items], refreshing: false,});
        console.log({items});
      }

    });

  }

  navigateToDetail(item){
    this.props.navigation.navigate('Detail', {item});
  }

  componentDidMount(){
    AppState.addEventListener('change', this.onChangeState);
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this.onChangeState);
  }

  onChangeState = (appState) => {
    if(appState === 'active'){
      this.onFetchRepositories(true);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputRapper}>
          <TextInput style={styles.input} onChangeText={ (text) => this.setState({text}) }/>
          <TouchableOpacity onPress={ () => this.onFetchRepositories(true) }>
            <Text style={styles.serchText}>Search</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data = {this.state.items}
          renderItem={({ item }) =>
                <TouchableOpacity style={{ padding: 10,}} onPress={() => this.navigateToDetail(item) } >
                  <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 7,}}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', }}>
                    <Image style={styles.ownerIcon} source={{ uri: item.owner.avatar_url }} />
                    <Text style={{}}>{item.owner.login}</Text>
                  </View>
                </TouchableOpacity>
              }
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => this.onFetchRepositories()}
          onEndReachedThreshold={0.1}
          onRefresh={() => this.onFetchRepositories(true)}
          refreshing= {this.state.refreshing}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  inputRapper: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EEE',
    borderRadius: 4,
  },
  serchText: {
    padding: 10,
  },
  touchableopacity: {
    padding: 20,
    backgroundColor: 'black',
  },
  ownerIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  }

});
