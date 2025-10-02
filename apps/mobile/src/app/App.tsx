// File: src/app/App.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Text,
  AppState,
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
import { UserMenuVisibilityProvider } from './navigation/UserMenuVisibilityContext';

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

  // ⬇️ AGGRESSIVE NAVIGATION BAR SETUP - APP RESTART FIX
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    
    const setupNavigationBar = async () => {
      try {
        // Daha güçlü şeffaflık değeri deneyelim
        await NavigationBar.setBackgroundColorAsync('rgba(252, 252, 252, 0.01)'); // Neredeyse tamamen şeffaf
        await NavigationBar.setButtonStyleAsync('dark');
        
        try {
          await NavigationBar.setBehaviorAsync('overlay-swipe');
        } catch {
          await NavigationBar.setBehaviorAsync('inset-swipe');
        }
        
        await NavigationBar.setVisibilityAsync('visible');
        
        if (typeof NavigationBar.setPositionAsync === 'function') {
          await NavigationBar.setPositionAsync('absolute');
        }
        
        console.log('✅ Navigation Bar: AGGRESSIVE setup tamamlandı');
      } catch (error) {
        console.log('❌ Navigation Bar error:', String(error));
      }
    };
    
    // ⬇️ MULTIPLE ATTEMPTS - APP RESTART İÇİN
    const attemptSetup = () => {
      setupNavigationBar();
      // 500ms sonra tekrar dene
      setTimeout(setupNavigationBar, 500);
      // 1s sonra tekrar dene  
      setTimeout(setupNavigationBar, 1000);
      // 2s sonra tekrar dene
      setTimeout(setupNavigationBar, 2000);
    };
    
    // Hemen başlat
    attemptSetup();
    
    // App state değişikliklerinde de çalıştır
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('🔄 App became active, re-applying navigation bar');
        setTimeout(setupNavigationBar, 100);
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []); // Sadece mount'ta bir kez

  // ⬇️ LOGIN SONRASI EK KONTROL
  useEffect(() => {
    if (Platform.OS !== 'android' || !isLoggedIn) return;
    
    const reinforceNavigationBar = async () => {
      try {
        await NavigationBar.setBackgroundColorAsync('rgba(0, 0, 0, 0.01)');
        await NavigationBar.setButtonStyleAsync('dark');
        
        try {
          await NavigationBar.setBehaviorAsync('overlay-swipe');
        } catch {
          await NavigationBar.setBehaviorAsync('inset-swipe');
        }
        
        console.log('✅ Navigation Bar: Login sonrası güçlendirildi');
      } catch (error) {
        console.log('❌ Navigation Bar reinforce error:', String(error));
      }
    };
    
    const timer = setTimeout(reinforceNavigationBar, 100);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

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
          <UserMenuVisibilityProvider>
            <View style={{ flex: 1 }}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </View>
          </UserMenuVisibilityProvider>
        </NotificationVisibilityProvider>
      </CartVisibilityProvider>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
