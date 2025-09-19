// File: src/app/App.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { CartVisibilityProvider } from './navigation/CartVisibilityContext';
import { NotificationVisibilityProvider } from './navigation/NotificationVisibilityContext';

import LoginContent from './components/LoginContent';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';

import { Host } from 'react-native-portalize';
import * as NavigationBar from 'expo-navigation-bar'; // ⬅️ Tek kontrol noktası

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('screen');
const LOGO_MARGIN_RATIO = 0.07906;
const PANEL_RATIO = 0.70;

function MainApp() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginContent = (type: string) => {
    switch (type) {
      case 'login':
        setShowLogin(true);
        break;
      case 'create':
        setShowCreate(true);
        break;
      case 'guest':
        setIsLoggedIn(true);
        break;
      case 'google':
        break;
      case 'apple':
        break;
      default:
        break;
    }
  };

  const PANEL_HEIGHT = SCREEN_H * PANEL_RATIO;
  const panelY = useRef(new Animated.Value(PANEL_HEIGHT)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(panelY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 3000);
    return () => clearTimeout(timer);
  }, [panelY]);

  if (!fontsLoaded) return null;

  if (isLoggedIn) {
    return (
      <CartVisibilityProvider>
        <NotificationVisibilityProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </NotificationVisibilityProvider>
      </CartVisibilityProvider>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <Video
        source={require('../../assets/videos/intro.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFill}
      />

      {!showCreate && !showLogin && (
        <Animated.View
          style={[
            styles.panel,
            {
              height: PANEL_HEIGHT,
              paddingBottom: 0,
              transform: [{ translateY: panelY }],
            },
          ]}
        >
          <LoginContent
            onGuestPress={() => setIsLoggedIn(true)}
            onButtonPress={handleLoginContent}
          />
        </Animated.View>
      )}

      {showLogin && (
        <LoginScreen
          onBack={() => setShowLogin(false)}
          onLogin={(email, password) => {
            console.log('Login:', email, password);
            setIsLoggedIn(true);
          }}
        />
      )}

      {showCreate && (
        <CreateAccountScreen onBack={() => setShowCreate(false)} />
      )}
    </View>
  );
}

export default function App() {
  // ⬇️ Android Navigation Bar: TEK MERKEZ
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const applyNavBar = async () => {
      try {
        // Yarı-şeffaf beyaz (AA RR GG BB) → %70 opak: B3
        await NavigationBar.setBackgroundColorAsync('rgba(255, 255, 255, 0.7)'); // '#B3000000'
        await NavigationBar.setButtonStyleAsync('dark');       // koyu ikonlar
        await NavigationBar.setBehaviorAsync('overlay-swipe'); // içerik barın altından aksın
        await NavigationBar.setVisibilityAsync('visible');     // bar görünür
      } catch (e) {
        console.log('NavBar setup error:', e);
      }
    };
    applyNavBar();
  }, []);

  return (
    <SafeAreaProvider>
      <Host>
        <MainApp />
      </Host>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: SCREEN_W,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});
