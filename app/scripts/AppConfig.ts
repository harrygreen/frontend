/// <reference path="../../modules/require.d.ts" />
/// <reference path="AppMain.ts" />
require.config({
    //baseUrl: '../' // commented for now
});

require(["AppMain"],
    (main) => {
    // code from window.onload
    var appMain = new main.AppMain();
    appMain.start();
});
