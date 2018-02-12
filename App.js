

import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { MapView } from 'expo';
import { Button } from 'react-native';

export default class App extends Component {

  constructor(props) {
  super(props);
  this.getLocations = this.getLocations.bind(this);
}
  state = {
    location:{coords: { latitude: 37.78825, longitude: -122.4324}},
    errorMessage: null,
    results: []
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
      this.getLocations();
    }
  }

  getLocations = async () => {
  return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.location.coords.latitude},${this.state.location.coords.longitude}&radius=50000&type=restaurant&key=AIzaSyC-F2fn5pzyoVhaZR4Yquu3vuIaVbCc-rM`)
    .then((response) => 
      response.json())
    .then((responseJson) => {
      console.log(responseJson)
      this.setState({results :responseJson.results});
    })
    .catch((error) => {
      console.error(error);
    });
}

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    {console.log(location)}
  };

  render() {
    let text = 'Waiting..';
    console.log(this.state)
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    return (
           <MapView
        style={{ flex: 1 }}
        region={{
          latitude: this.state.location.coords.latitude,
          longitude: this.state.location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
    <View style={styles.buttonContainer}>
      <Button title='Click Me!' onPress={() => console.log('Clicked')} />
    </View>
  </MapView>

    );
      {console.log(this.state)}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: 80,
    backgroundColor: 'transparent',
  },

});
