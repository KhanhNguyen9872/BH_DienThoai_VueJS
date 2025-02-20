const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = defineConfig({
    configureWebpack: {
        plugins: [
          new webpack.DefinePlugin({
            // Vue CLI is in maintenance mode, and probably won't merge my PR to fix this in their tooling
            // https://github.com/vuejs/vue-cli/pull/7443
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
          }),
          // new JavaScriptObfuscator({
          //   compact: true,                       // Remove extra spaces and newlines
          //   controlFlowFlattening: true,         // Flatten control flow to make the code harder to follow
          //   controlFlowFlatteningThreshold: 1,   // Maximum level of control flow flattening
          //   deadCodeInjection: true,             // Add dead code to confuse readers
          //   deadCodeInjectionThreshold: 0.4,     // Percentage of dead code to inject
          //   debugProtection: false,               // Make debugging difficult by disabling breakpoints
          //   debugProtectionInterval: 4000,       // Set the interval for how often protection kicks in
          //   disableConsoleOutput: true,          // Remove console logs, making debugging harder
          //   identifierNamesGenerator: 'mangled', // Generate mangled variable names
          //   identifiersPrefix: 'khanhstore_',    // Prefix all obfuscated identifiers with a custom string
          //   renameGlobals: true,                 // Rename global variables
          //   rotateStringArray: true,             // Shuffle string array indexes
          //   selfDefending: true,                 // Make the code harder to modify or understand at runtime
          //   stringArray: true,                   // Convert all strings into an array to obfuscate them
          //   stringArrayEncoding: ['base64', 'rc4'],     // Use base64 encoding for string arrays
          //   stringArrayThreshold: 0.75,           // Only obfuscate strings that are used more than 75% of the time
          //   transformObjectKeys: true,           // Obfuscate object property keys
          //   transformRegExpLiterals: true        // Obfuscate regular expression literals
          // }),
        ],
      },
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all",
        https: false,
        port: 8081
    }
})