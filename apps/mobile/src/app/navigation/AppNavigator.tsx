import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import SellerStepOneScreen from '../screens/seller/SellerStepOneScreen';
import ProductScreen from '../screens/ProductScreen';
import SellerProfileScreen from '../screens/seller/SellerProfileScreen';
import CollectionScreen from '../screens/CollectionScreen';
import CurationScreen from '../screens/CurationScreen';

export type AppStackParamList = {
  Main: undefined;
  SellerStepOne: undefined;
  Product: {
    Product: { images: string[]; price: string };
    title: string;
    description: string;
    price: string;
  };
  SellerProfileScreen: undefined;
  CollectionScreen: { item: any };
  CurationScreen: { item: any };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="SellerStepOne" component={SellerStepOneScreen} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="SellerProfileScreen" component={SellerProfileScreen} />
      <Stack.Screen name="CollectionScreen" component={CollectionScreen} />
      <Stack.Screen name="CurationScreen" component={CurationScreen} />
    </Stack.Navigator>
  );
}
