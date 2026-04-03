// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// // Ensure assets are properly handled and not double-processed
// config.project.ios = {
//   project: __dirname + '/ios',
// };

// config.project.android = {
//   project: __dirname + '/android',
// };

// // Exclude problematic node_modules and build artifacts
// config.resolver.blockList = [
//   /node_modules\/.*\/node_modules/,
//   /gradle/,
//   /.gradle/,
// ];

// // Optimize asset loading
// config.resolver.assetExts = [
//   ...config.resolver.assetExts.filter(ext => ext !== 'png'),
//   'png',
//   'jpg',
//   'jpeg',
//   'gif',
//   'webp',
// ];

// module.exports = config;


const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);