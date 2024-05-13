import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
// import axios from '../axios'; // Import your Axios instance
import "./home.css";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function Station() {
    const route = useRoute();
    const receivedData = route.params?.data;
    console.log(receivedData);
    const username = route.params?.username;

    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    //sending booked slots to database
    const handleConfirm = async (location, slot) => {
        try{
            const response = await axios.post('http://192.168.29.8:5000/confirmSlot', { username, location, slot });
            // Handle successful confirmation
            console.log('Slot confirmed:', response.data);
        }
        catch (error) {
            console.error('Error booking slot', error.message);
            // Handle error (e.g., display error message)
        }
    };

    return(
        <View>
            {receivedData.map((item, index) => (
                <View key={index}>
                    <Button 
                        style={style.card} 
                        title={`${item.name} - ${item.location}`}
                        onPress={() => setIsExpanded(!isExpanded)}
                    />
                    {isExpanded && (
                        <Picker 
                            selectedValue={selectedValue}
                            onValueChange={(itemValue, itemIndex)=> {
                                setSelectedValue(itemValue);
                                setSelectedLocation(item.location);
                            }}
                        >
                            <Picker.Item label='12:00 a.m. to 1:00 p.m' value ='12-1' />
                            <Picker.Item label='1:00 p.m. to 2:00 p.m' value ='1-2' />
                            <Picker.Item label='2:00 p.m. to 3:00 p.m' value ='2-3' />
                            <Picker.Item label='3:00 p.m. to 4:00 p.m' value ='3-4' />
                            <Picker.Item label='4:00 p.m. to 5:00 p.m' value ='4-5' />
                            <Picker.Item label='5:00 p.m. to 6:00 p.m' value ='5-6' />
                            <Picker.Item label='6:00 p.m. to 7:00 p.m' value ='6-7' />
                            <Picker.Item label='7:00 p.m. to 8:00 p.m' value ='7-8' />
                            <Picker.Item label='8:00 p.m. to 9:00 p.m' value ='8-9' />
                            <Picker.Item label='9:00 p.m. to 10:00 p.m' value ='9-10' />
                            <Picker.Item label='10:00 p.m. to 11:00 p.m' value ='10-11' />
                            <Picker.Item label='11:00 p.m. to 12:00 a.m' value ='11-12' />
                        </Picker>
                    )}
                </View>
            ))}
            <Button 
                title="Confirm"
                onPress={() => handleConfirm(selectedLocation, selectedValue)}
            />
        </View>
    );
};

const style = StyleSheet.create({
    card: {
        border: 'solid 1px #151515',
        top: '10px',
        left: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        fontSize: '20px',
    }
});