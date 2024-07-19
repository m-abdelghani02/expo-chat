import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  Image,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const tabs = [1, 2, 3, 4, 5];
export default class App extends Component {
  render() {
    return (
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <View style={styles.subContent}>
            {tabs.map((_tabs, i) => {
              return (
                <TouchableHighlight
                  key={i}
                  underlayColor={"transparent"}
                  onPress={() => console.log("onPress")}
                >
                  <View>
                  </View>
                </TouchableHighlight>
              );
            })}
          </View>
          <View className='justify-center items-center'>
              <Image source={require('../assets/BottomBar.png')} className="w-full h-30 "/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "column",
    zIndex: 0,
    width: Dimensions.get("window").width ,
    marginBottom: "0%",
    left: "0%",
    right: "0%",
    position: "absolute",
    bottom: "0%",
  },
  subContent: {
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    zIndex: 1,
    position: "absolute",
    bottom: 0,
  }
});