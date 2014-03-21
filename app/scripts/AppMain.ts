
//1.calling a class
/// <reference path="classes/Father" />
/*
import gt = require("classes/Father");

export class AppMain {
    public start() {
        var child = new gt.Father();
        child.start("I'm saying something");
    }
}
*/
//calling an children class
/// <reference path="classes/Child" />

import gt = require("classes/Child");

export class AppMain {
    public start() {
        var child = new gt.Child();
        child.start("something");
    }
}
