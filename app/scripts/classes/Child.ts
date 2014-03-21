/// <reference path="Father" />

import gt = require("classes/Father");

export class Child extends gt.Father  {
	public start(me: string) {
		super.start(me); //uncoment me to show that I can preserve parent functionality easy
		this.say("child " + me);
		this.btn_interface();
    }

    btn_interface() {
    	var button = document.createElement("button");
    	button.textContent = "Say Hello";
    	var _self = this;
		button.onclick = function() {
		    _self.say("child " + "Say Hello");
		};
		this.el.appendChild(button);
    }
}
