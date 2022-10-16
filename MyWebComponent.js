import { useState } from "react";
import WebView from "react-native-webview";
import { ActivityIndicator, View } from "react-native";

const MyWebComponent = (uri) => {
  const [visible, setVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={uri}
        onLoadStart={() => setVisible(true)}
        onLoadEnd={() => setVisible(false)}
      ></WebView>
      {visible && (
        <ActivityIndicator
          style={{
            backgroundColor: "rgba(52, 52, 52, 0.8)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            jusityContent: "space-around",
            flexWrap: "wrap",
            alignContent: "center",
          }}
          size="large"
        ></ActivityIndicator>
      )}
    </View>
  );
};

export default MyWebComponent;
