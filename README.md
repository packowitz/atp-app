## Installing required plugins: 
* ionic plugin add cordova-plugin-camera --variable PHOTOLIBRARY_USAGE_DESCRIPTION="ATP uses photos" --variable CAMERA_USAGE_DESCRIPTION="ATP uses camera"

* ionic plugin add cordova-plugin-inapppurchase

* ionic plugin add cordova-plugin-firebase

## Developing:
* Install all node_modules via npm: $ npm install
* Make sure you have Ionic v2 globally installed $ npm install -g ionic
* Start watching and building the client $ ionic serve
* To build prod: $ npm run ionic:build --prod --aot --minifyJs --minifyCss --optimizeJs
