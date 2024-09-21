import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SearchBar } from "react-native-elements";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Image } from "react-native";

// Main Component
export default function HomeScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nearbyCitiesWeather, setNearbyCitiesWeather] = useState([]);

  // Fetch Weather Data for the Entered City
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");
    try {
      const API_KEY = "8217a10e9cf4de6a0a7f1eb21bec44cf";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

      const response = await axios.get(url);
      const data = response.data;
      setWeather(data);

      const latitude = data.coord.lat;
      const longitude = data.coord.lon;

      // Fetch nearby cities based on the latitude and longitude
      fetchNearbyCities(latitude, longitude);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyCities = async (lat, lon) => {
    const API_KEY = "8217a10e9cf4de6a0a7f1eb21bec44cf";
    const cnt = 5; // Number of nearby cities to show
    const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(url);
      setNearbyCitiesWeather(response.data.list);
    } catch (err) {
      console.error("Failed to fetch nearby cities", err);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageBackground
        source={require("../assets/images/third.avif")}
        style={styles.background}
      >
        <View style={styles.background}>
          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Enter City"
                onChangeText={(value) => setCity(value)}
                value={city}
                containerStyle={styles.searchBar}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{ color: "white" }}
              />
              <TouchableOpacity onPress={() => fetchWeather(city)}>
                <Icon name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#FFC229" />
            ) : weather ? (
              <>
                {/* Weather Overview */}
                <View style={styles.weatherContainer}>
                  <Text style={styles.cityName}>{weather.name}</Text>
                  <Text style={styles.temp}>
                    {Math.round(weather.main.temp)}°C
                  </Text>
                  <Text style={styles.description}>
                    {weather.weather[0].description}{" "}
                    <MaterialCommunityIcons
                      name="weather-cloudy"
                      size={24}
                      color="white"
                    />
                  </Text>
                </View>

                {/* Weather Details with Icons */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailsRow}>
                    <MaterialCommunityIcons
                      name="thermometer"
                      size={24}
                      color="#FFC229"
                    />
                    <Text style={styles.detailLabel}>Feels Like</Text>
                    <Text style={styles.detailValue}>
                      {Math.round(weather.main.feels_like)}°C
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <MaterialCommunityIcons
                      name="thermometer-low"
                      size={24}
                      color="#FFC229"
                    />
                    <Text style={styles.detailLabel}>Min Temp</Text>
                    <Text style={styles.detailValue}>
                      {Math.round(weather.main.temp_min)}°C
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <MaterialCommunityIcons
                      name="thermometer-high"
                      size={24}
                      color="#FFC229"
                    />
                    <Text style={styles.detailLabel}>Max Temp</Text>
                    <Text style={styles.detailValue}>
                      {Math.round(weather.main.temp_max)}°C
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <MaterialCommunityIcons
                      name="gauge"
                      size={24}
                      color="#FFC229"
                    />
                    <Text style={styles.detailLabel}>Pressure</Text>
                    <Text style={styles.detailValue}>
                      {weather.main.pressure} hPa
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <MaterialCommunityIcons
                      name="water-percent"
                      size={24}
                      color="#FFC229"
                    />
                    <Text style={styles.detailLabel}>Humidity</Text>
                    <Text style={styles.detailValue}>
                      {weather.main.humidity}%
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    {/* <MaterialCommunityIcons
                    name="weather-windy"
                    size={24}
                    color="#FFC229"
                  /> */}
                    <Image
                      source={require("../assets/images/Tornado.png")}
                      style={styles.imageStyle}
                    />

                    <Text style={styles.detailLabel}>Wind Speed</Text>
                    <Text style={styles.detailValue}>
                      {weather.wind.speed} m/s
                    </Text>
                  </View>
                </View>

                {/* Nearby Cities */}
                <Text style={styles.nearbyHeader}>{weather.name} Area's</Text>
                {nearbyCitiesWeather.length > 0 ? (
                  nearbyCitiesWeather.map((city) => (
                    <View key={city.id} style={styles.nearbyCityContainer}>
                      <Text style={styles.nearbyCityName}>{city.name}</Text>
                      <Text style={styles.nearbyCityTemp}>
                        {Math.round(city.main.temp)}°C
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noNearbyCitiesText}>
                    No nearby cities found.
                  </Text>
                )}
              </>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingVertical: 30,
    width: "100%"
  },
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    padding: 10,
    width: "90%",
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "transparent",
    flex: 1,
    border: "none",
    outline: "none",
  },
  inputContainer: {
    backgroundColor: "transparent",
  },
  weatherContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 25,
    borderRadius: 20,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cityName: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  temp: {
    fontSize: 80,
    color: "#FFC229",
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 10,
  },
  detailsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    width: "90%",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "#FFF",
  },
  detailValue: {
    fontSize: 16,
    color: "#FFC229",
    fontWeight: "bold",
  },
  nearbyHeader: {
    fontSize: 24,
    color: "#FFC229",
    fontWeight: "bold",
    marginTop: 20,
  },
  nearbyCityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF",
    marginBottom: 10,
  },
  nearbyCityName: {
    fontSize: 18,
    color: "white",
  },
  nearbyCityTemp: {
    fontSize: 18,
    color: "#FFC229",
  },
  noNearbyCitiesText: {
    color: "white",
    marginTop: 10,
  },
  imageStyle: {
    width: 32,
    height: 32,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
});
