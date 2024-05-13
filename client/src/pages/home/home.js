import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TextInput, Button, ImageBackground } from 'react-native';
// import axios from '../axios'; // Import your Axios instance
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import "./home.css";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Home() {
    const [location, setLocation] = useState(null);
    const [chargingStations, setChargingStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);
    const [searchWidth, setSearchWidth] = useState('45%');


    //Get user location
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
          }
    
          try {
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            fetchChargingStations(location.coords.latitude, location.coords.longitude);
          } catch (error) {
            console.error('Error fetching location:', error);
          }
        })();
    }, []);
    

    //opencharge api
    const fetchChargingStations = async () => {
        const apiKey = ''; // Replace with your actual API key
        try {
          const response = await axios.get('https://api.openchargemap.io/v3/poi', {
            params: {
              output: 'json',
              countrycode: 'IN',
              maxresults: 10000,
              key: apiKey,
            },
          });
          setChargingStations(response.data);
        } catch (error) {
          console.error('Error fetching charging stations:', error);
        }
    };

    //google maps search bar
    const handleSearch = async () => {
        try {
          const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
              address: source,
              key: 'YOUR_GOOGLE_PLACES_API_KEY',
            },
          });
          const sourceLocation = response.data.results[0].geometry.location;
          console.log('Source Location:', sourceLocation);
    
          // Similarly, you can fetch destination location using Google Places API
          // Update state with destination coordinates
          setDestinationCoordinates(destinationLocation);
    
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      };
    
      const handleInputFocus = () => {
        setSearchWidth('90%'); // Adjust search box width when input is focused
      };
    
      const handleInputBlur = () => {
        setSearchWidth('45%'); // Reset search box width when input is blurred
      };
    
    


    //book now button
    const navigator = useNavigation();
    const route = useRoute();
    const username = route.params?.data;

    const handleStation = async () => {
        try{
            const response = await axios.post('http://192.168.29.8:5000/charging_stations');
            console.log(response.data);
            navigator.navigate(('Station'), { data: response.data, username: username });
            
        }catch(error){
            console.error('no stations found nearby', error.message);
        }
    };

    return(
      <View style={styles.container}>
        <StatusBar style="auto" />
        <MapView
          style={styles.map}
          initialRegion={{
          latitude: location ? location.coords.latitude : 0,
          longitude: location ? location.coords.longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      > 
        {chargingStations.map((station) => (
          <Marker
            key={station.ID}
            coordinate={{
              latitude: station.AddressInfo.Latitude,
              longitude: station.AddressInfo.Longitude,
            }}
            pinColor={station.StatusType.IsOperational ? 'green' : 'red'}
            onPress={() => setSelectedStation(station)}
          >
            <Callout>
              <View>
                <Text style={{ fontWeight: 'bold' }}>{station.AddressInfo.Title}</Text>
                <Text>Location: {station.AddressInfo.AddressLine1}</Text>
                <Text>Operational: {station.StatusType.IsOperational ? 'Yes' : 'No'}</Text>
                <Text>Number of Points: {station.NumberOfPoints}</Text>
              </View>
            </Callout>
          </Marker>
        ))}


        {/* Destination Marker */}
        {destinationCoordinates && (
          <Marker
            coordinate={destinationCoordinates}
            title="Destination"
            pinColor="red"
          />
        )}
      </MapView>
      <View style={[styles.searchContainer, { width: searchWidth }]}>
        <TextInput
          style={styles.input}
          placeholder="Source"
          value={source}
          onChangeText={setSource}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
          <View style={styles.buttontop}>
            <Button title="Book now" onPress={handleStation}/>
          </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    searchContainer: {
      position: 'absolute',
      top: 20,
      left: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 10,
    },
    buttontop: {
      top: '50%',
      left: '50%',
      position: 'absolute',
    }
  });

  
  