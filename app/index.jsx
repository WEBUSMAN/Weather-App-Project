import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, ImageBackground } from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const API_KEY = '8217a10e9cf4de6a0a7f1eb21bec44cf';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://source.unsplash.com/random?weather' }} style={styles.background}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={fetchWeather}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchInput}
          placeholderTextColor="#b0b0b0"
        />

        {loading && <ActivityIndicator size="large" color="#ffffff" />}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : weather ? (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherTitle}>{weather.name}</Text>
            <Text style={styles.weatherDetail}>Temperature: {weather.main.temp}°C</Text>
            <Text style={styles.weatherDetail}>Weather: {weather.weather[0].description}</Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Search for a city to get weather details</Text>
        )}

        <Button title="Get Weather" onPress={fetchWeather} color="#6200ea" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: "darkblue"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  searchBarContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
  },
  weatherCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    marginVertical: 16,
  },
  weatherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  weatherDetail: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    color: '#ffffff',
  },
});