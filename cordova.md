cordova platform update android@6.2.3

cordova platform add android@6.2.3

You can update any plugin by removing it, and then re-adding it.

E.g. To update your camera plugin:
```
cordova plugin rm cordova-plugin-camera --save
cordova plugin add cordova-plugin-camera@latest --save
```
cordova prepare
