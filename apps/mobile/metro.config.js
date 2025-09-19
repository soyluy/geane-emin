// apps/mobile/metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

// Mevcut Expo Metro konfigürasyonunu al
const config = getDefaultConfig(__dirname);

// 1) SVG’i normal assetExts listesinden çıkar
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');

// 2) SVG’i kaynak kod (sourceExts) listesine ekle
config.resolver.sourceExts = [...sourceExts, 'svg'];

// 3) SVG dosyalarını dönüştürmesi için transformer’ı ayarla
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
