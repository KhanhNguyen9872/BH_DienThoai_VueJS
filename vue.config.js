const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all",
        https: false,
        port: 8080
    }
})