import React, { useState, useEffect,useRef } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import axios from 'axios';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [listening, setListening] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const startListening = () => {
    if(!cameraRef.current){
      console.error("Error: Camera is not ready yet");
      return;
    }
    setListening(true);
    console.log("Started listening");
    DeviceEventEmitter.addListener('keyDown', event => {
      if (event.key === 'volumeDown' && listening) {
        takePicture();
      }
    });
  };

  const stopListening = () => {
    setListening(false);
    console.log("Stopped listening.")
    DeviceEventEmitter.removeAllListeners();
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      console.error("Error: Camera is not ready yet");
      return;
    }
    try {
      console.log("Take picture started.")
      const data = await cameraRef.current.takePictureAsync();
      setImage(data.uri);
      const response = await axios.post('http://your-webserver-ip:5000', data.base64);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
        />
      ) : (
        <View style={styles.pictureContainer}>
          <Image
            style={styles.picture}
            source={{ uri: image }}
          />
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={startListening}>
          <Text style={styles.buttonText}>Start Listening</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopListening}>
          <Text style={styles.buttonText}>Stop Listening</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  pictureContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    width: '80%',
    height: '80%',
  },
  buttonsContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

