export class Father  {
	el: HTMLSpanElement;

	public start(me: string) {
		this.el = document.createElement("span");
		var content = document.getElementById("content");
		content.appendChild(this.el);

        this.say("father "  + me);
    }

    public say(words: string) {
    	this.el.innerHTML = words;
    }
}
