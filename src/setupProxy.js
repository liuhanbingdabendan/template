//setupProxy.js
const proxy = require('http-proxy-middleware')

module.exports = function(app) {

 app.use(
  proxy(
    '/api',
   { 
      //target: "http://test-duomi-admin.trustrock.in/", 
      //target: 'http://172.16.20.227:8080',
      target:'http://172.16.20.5:8080',
      changeOrigin:true,
      pathRewrite: {
              "^/api": "/"
          }
   }))
}