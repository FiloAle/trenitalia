const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

const config = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = config;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// Custom resolver: on web/node environments, avoid loading .ios.js files
// that call requireNativeViewManager (e.g. expo-symbols/SymbolView.ios.js)
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...sourceExts, "svg"],
  resolveRequest: (context, moduleName, platform) => {
    // For web/node environments, block .ios platform-specific resolution
    // by falling through to the non-platform-specific version
    if (platform === "web" || context.customResolverOptions?.environment === "node") {
      // If the resolved file ends in .ios.js, try to find the non-iOS version
      try {
        const result = (originalResolveRequest || context.resolveRequest)(context, moduleName, platform);
        if (result && result.filePath && result.filePath.endsWith(".ios.js")) {
          const genericPath = result.filePath.replace(".ios.js", ".js");
          if (fs.existsSync(genericPath)) {
            return { ...result, filePath: genericPath };
          }
        }
        return result;
      } catch (e) {
        // Fall through to default resolution
      }
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
