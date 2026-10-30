/*
    settings = {
        "disabled" : false,
        "waiting"  : false,
        onClick    : function() {
            console.log("works");
        } 
    }

    Button.enable()   
    Button.disable();
    Button.wait();
    Button.stopWaiting();
*/

export default class Button {
    constructor(node, settings) {
        this.args = [];
        this.set("node", node);

        this.applySettings(settings);
        this.listenClicks();

        this.run();
    }

    run() {
        if (this.get("disabled") === true) {
            this.disable();
        }
        else {
            this.enable();
        }

        if (this.get("waiting") === true) {
            this.wait();
        }
        else {
            this.stopWaiting();
        }        
    }

    enable() {
        let node = this.get("node");
        node.classList.remove("disabled");
        this.set("disabled", false);
    }

    disable() {
        let node = this.get("node");
        node.classList.add("disabled");
        this.set("disabled", true);
    }

    wait() {
        let node = this.get("node");
        node.classList.add("waiting");
        this.set("waiting", true);
    }

    stopWaiting() {
        let node = this.get("node");
        node.classList.remove("waiting");
        this.set("waiting", false);
    }

    listenClicks() {
     
        let node = this.get("node");
        
        let onClick = this.onClick.bind(this);
        node.addEventListener("click", onClick);
        

    }   
    
    onClick() {
        
        if (this.get("disabled") === true) {
            return false;
        }

        if (this.get("waiting") === true) {
            return false;
        }


        this.wait();
        
        this.get("onClick")(this);
        
    }    


    applySettings(settings) {

        let defaultSettings = {
            "disabled" : false,
            "waiting"  : false,
            onClick    : function() {
                console.log("works");
            } 
        }
        
        for (let i in defaultSettings) {
            this.set(i, defaultSettings[i]);
        }

        for (let i in settings) {
            this.set(i, settings[i]);
        }
    }


    get(k) {
        if (typeof this.args[k] == "undefined")
            return false;
        else 
            return this.args[k];
    }

    set(k, v) {
        this.args[k] = v;
    }
}