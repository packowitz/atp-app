## Installing required plugins: 
* ionic plugin add cordova-plugin-camera

* cordova plugin add cordova-plugin-inapppurchase

* cordova plugin add cordova-plugin-firebase@0.1.18 --save

## Developing:
* Install all node_modules via npm: $ npm install
* Make sure you have Ionic v2 globally installed $ npm install -g ionic
* Start watching and building the client $ ionic serve
* To build prod: $ npm run ionic:build --prod --aot --minifyJs --minifyCss --optimizeJs
