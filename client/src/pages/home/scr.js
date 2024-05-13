import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, TextInput, Button, Linking } from 'react-native';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
//////
import { loaction, chargeStations } from './location';
import { getPreciseDistance, getCenter } from 'geolib';

export default function Home() {
    const [location, setLocation] = useState(null);
    const [chargingStations, setChargingStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);
    const [searchWidth, setSearchWidth] = useState('45%');
    const [directions, setDirections] = useState([]);
    ////
    const [userlocation, setUserlocation] = useState(null);

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
                setUserlocation(location.coords);
                fetchChargingStations(location.coords.latitude, location.coords.longitude);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        })();
    }, []);

    const fetchChargingStations = async () => {
        const url = 'https://ev-charge-finder.p.rapidapi.com/search-by-location';
        const params = {
          near: 'New York, NY, USA',
          limit: '20'
        };
      
        const headers = {
          'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
          'X-RapidAPI-Host': 'ev-charge-finder.p.rapidapi.com'
        };

        const apiKey = '9b15606a-fcb3-4ec8-86c7-1b3fba02234b';
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

    const handleSearch = async () => {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: source,
                    key: 'AIzaSyAgbrTDExWIfCTPLYBAa9EiIlIp6tcCBI0',
                },
            });
            console.log(response.data);
            const sourceLocation = response.data.results[0].geometry.location;

            // const directionsResponse = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            //     params: {
            //         origin: source, // Source coordinates or address
            //         destination: destination, // Destination coordinates or address
            //         key: 'AIzaSyACYVyCNM051Tno3Mh6K2fSJUzyrvgkaCo',
            //     },
            // });
            const route = directionsResponse.data.routes[0];
            const polyline = route.overview_polyline.points;
            const points = decodePolyline(polyline);
            setDirections(points);

            setDestinationCoordinates(sourceLocation);

        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    const handleInputFocus = () => {
        setSearchWidth('90%');
    };

    const handleInputBlur = () => {
        setSearchWidth('45%');
    };

    const navigator = useNavigation();
    const route = useRoute();
    const username = route.params?.data;

    // const handleStation = async () => {
    //     try {
    //         const response = await axios.post('http://192.168.0.103:5000/charging_stations');
    //         console.log(response.data);
    //         navigator.navigate(('Station'), { data: response.data, username: username });

    //     } catch (error) {
    //         console.error('no stations found nearby', error.message);
    //     }
    // };
    /////
    function  get_src_distances (userlocation, loc) {
      const distances = loc.map(location => {
        const distance = getPreciseDistance(userlocation, location);
        return { ...location, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      const c = distances.slice(0, 8);
      return c;
    };

    function get_dest_distances (dest) {
      const matchedLocation = loaction.find(loc => loc.name.toLowerCase() === dest.toLowerCase());
      if (matchedLocation) {
          console.log(matchedLocation);
          const middlePoint = getCenter([userlocation, matchedLocation]);
          
          const distances = chargeStations.map(location => {
              const distance = getPreciseDistance(middlePoint, location);
              return { ...location, distance };
          });
          distances.sort((a, b) => a.distance - b.distance);
          return distances;
      }
      else {
        console.log(`Destination ${dest} not found.`);
      }
    }

    const handleStation = async () => {
      try {
          let station = get_src_distances (userlocation, chargeStations);
          navigator.navigate(('Station'), { data: station, username: username });

      } catch (error) {
          console.error('no stations found nearby', error.message);
      }
  };

    function destination_finder (dest) {
      try {
        const matchedLocation = loaction.find(loc => loc.name.toLowerCase() === dest.toLowerCase());
        if (matchedLocation) {
            console.log(matchedLocation);
            const middlePoint = getCenter([userlocation, matchedLocation]);
            const distances = chargeStations.map(location => {
                const distance = getPreciseDistance(middlePoint, location);
                return { ...location, distance };
            });
            distances.sort((a, b) => a.distance - b.distance);

            let dist = get_dest_distances(dest);
            //haversinee///


            //haversinee///

            console.log(dist[0]);
            const url = `https://www.google.com/maps/dir/${userlocation.latitude},${userlocation.longitude}/${dist[0].latitude},${dist[0].longitude}/${matchedLocation.latitude},${matchedLocation.longitude}`;
            Linking.openURL(url)
        } else {
            console.log(`Destination ${dest} not found.`);
        }
      }
      catch (error) {
        console.error(error);
      }
    };

    return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.mapContainer}>
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
              {/* {chargeStations.map((charge) => (
                <Marker
                  key={charge.id}
                  coordinate={{
                    latitude: charge.latitude,
                    longitude: charge.longitude,
                  }}
                  pinColor={'green'}
                  onPress={() => setSelectedStation(charge)}
                >
                  <Callout>
                    <View>
                      <Text style={{ fontWeight: 'bold' }}>{charge.name}</Text>
                    </View>
                  </Callout>

                </Marker>
              ))} */}
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
                  pinColor="red" // Customize marker color
                />
              )}
            </MapView>
          </View>
          <View style={styles.searchContainer}>
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
            <Button title="Search" onPress={() => { destination_finder(destination) }} />
          </View>
          <View style={styles.bottomContainer}>
            <Button title="Book Now" onPress={handleStation} />
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      mapContainer: {
        flex: 1,
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      searchContainer: {
        position: 'absolute',
        top: 40,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      bottomContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        paddingHorizontal: 10,
      },
      input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 10,
      },
    });

// Function to decode polyline points
function decodePolyline(encoded) {
    var poly = [];
    var index = 0;
    var len = encoded.length;
    var lat = 0;
    var lng = 0;

    while (index < len) {
        var b;
        var shift = 0;
        var result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        var p = {
            latitude: lat / 1e5,
            longitude: lng / 1e5
        };
        poly.push(p);
    }
    return poly;
}
