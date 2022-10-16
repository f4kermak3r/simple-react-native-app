import {
  Button,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import FadeInView from "./FadeInView";
import MyWebComponent from "./MyWebComponent";

export const App = () => {
  const [showFirstWeb, setFirstWeb] = useState(false);
  const [showSecondWeb, setSecondWeb] = useState(false);
  const [showRunButton, setRunButton] = useState(false);
  const [sound, setSound] = useState();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/swoosh.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const storeFirstWeb = async () => {
    try {
      const newShowFirstWeb = !showFirstWeb;
      setFirstWeb(newShowFirstWeb);
      setSecondWeb(false);
      setRunButton(false);

      const jsonValue = JSON.stringify(newShowFirstWeb);
      await AsyncStorage.multiSet([
        ["@first_Web", jsonValue],
        ["@second_Web", JSON.stringify(false)],
      ]);
    } catch (e) {
      console.log("error in first web store: ", e);
    }
  };

  const storeSecondWeb = async () => {
    try {
      const newShowSecondWeb = !showSecondWeb;
      setSecondWeb(newShowSecondWeb);
      setFirstWeb(false);
      setRunButton(false);

      const jsonValue = JSON.stringify(newShowSecondWeb);
      await AsyncStorage.multiSet([
        ["@first_Web", JSON.stringify(false)],
        ["@second_Web", jsonValue],
      ]);
    } catch (e) {
      console.log("error in second web store: ", e);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.multiSet([
        ["@first_Web", JSON.stringify(false)],
        ["@second_Web", JSON.stringify(false)],
      ]);

      alert("Cache successfully cleared!");
    } catch (e) {
      console.log("error in cache clearing: ", e);
    }
  };

  const runAway = async () => {
    await AsyncStorage.multiSet([
      ["@first_Web", JSON.stringify(false)],
      ["@second_Web", JSON.stringify(false)],
    ]);

    setFirstWeb(false);
    setSecondWeb(false);
    setRunButton(!showRunButton);
  };

  useEffect(() => {
    const getData = async () => {
      await AsyncStorage.multiGet(["@first_Web", "@second_Web"]).then(
        (response) => {
          setFirstWeb(JSON.parse(response[0][1]));
          setSecondWeb(JSON.parse(response[1][1]));
        }
      );
    };
    getData();
  }, []);

  const randomLoc1 = {
    top: Math.floor(Math.random() * -300),
    left: Math.floor(Math.random() * 125),
  };

  return (
    <View style={styles.containerStyle}>
      <View style={styles.buttonContainerStyle}>
        <View style={styles.buttonStyle}>
          <Button title="google" onPress={storeFirstWeb} />
        </View>
        <View style={styles.buttonStyle}>
          <Button title="news" onPress={storeSecondWeb} />
        </View>
        <View style={styles.buttonStyle}>
          <Button title="clear" onPress={clearCache} />
        </View>
        <View style={styles.buttonStyle}>
          <Button title="Run" onPress={runAway} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {showFirstWeb && <MyWebComponent uri="https://www.google.com/" />}
        {showSecondWeb && <MyWebComponent uri="https://www.bbc.com/" />}
        {showFirstWeb === false &&
          showSecondWeb === false &&
          showRunButton === false && (
            <View style={{ alignItems: "center" }}>
              <FadeInView
                style={{
                  backgroundColor: "rgba(163, 164, 255, 0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 10,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    textAlign: "center",
                    margin: 10,
                    width: 350,
                    color: "white",
                  }}
                >
                  Tauras Dubinskas
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    textAlign: "center",
                    margin: 10,
                    color: "white",
                  }}
                >
                  MKDFs-19 group
                </Text>
              </FadeInView>
            </View>
          )}
      </View>
      {showRunButton && !showFirstWeb && !showSecondWeb && (
        <Pressable
          onPress={() => playSound()}
          style={[styles.button, randomLoc1]}
        >
          <Text style={styles.text}>Press me</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    display: "flex",
    backgroundColor: "#1a2369",
  },
  buttonContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#1c2b9c",
    height: 75,
    padding: 10,
  },
  buttonStyle: {
    width: 73,
    height: 40,
    margin: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "red",
    width: 120,
    height: 65,
  },
  text: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: "white",
    textAlign: "center",
  },
  nameContainer: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 4,
  },
});

export default App;
