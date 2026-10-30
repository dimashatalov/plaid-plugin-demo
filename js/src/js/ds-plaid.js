import Button from "./button.js";

class DsPlaid {
    constructor() {
        /*this.headLineMenu       = new HeadLineMenu();
        this.brandSlider        = new BrandSlider();
        this.productSlider      = new ProductSlider();
        this.productShowMore    = new ProductShowMore();
        this.productFooterCart        = new ProductFooterCart();
        */

        this.reset();
 
    }

    reset() {
        this.callbacks = {
            "auth" : [],
            "identity" : [],
            "exit" :[], 
            "OPEN" : [],
            "IDENTITY_VERIFICATION_START_STEP" : [],
            "IDENTITY_VERIFICATION_PASS_SESSION" : [], 
            "IDENTITY_VERIFICATION_CLOSE_UI" : [],
            "IDENTITY_VERIFICATION_FAIL_SESSION" : [],
            "HANDOFF" : []
        }   

        this.onSuccessStatus = 0;
        this.uuid = false;
        this.requestId = false;
        this.link_session_id = false;        
    }

    async run() {
        
        
        var self = this;

        if (this.isPlaidLibraryReady() === false) {
            // Relaunch if plaid library is not loaded
            setTimeout(function() {
                self.run();
            }, 1000);

            return false;
        }
        else {
            
        }

        if (this.isPlaidContainer() === false) {
            return false;
        }

        this.uuid = this.getCookie("user_uuid");
 
        if (typeof this.uuid == "undefined") {
            return false;
        }


        this.listenEvents();


        //await this.makeLink();
        //this.initLink();
//        this.initLink();

      
    }

    listenEvents() {
        let nodes = [...document.querySelectorAll(".action__verify-identity")];

        nodes.map((node) => {
            let onIdentifyClick = this.onIdentifyClick.bind(this);
            node.Button = new Button(node, {
                onClick : async function(button) {
                    onIdentifyClick();
                }
            });

        });
    }

    async onIdentifyClick() {
        await this.makeLink();
        this.initLink();
    }


    getValue() {

    }


    async start() {
        await this.makeLink();
        this.initLink();
    }

    async startDocumentVerification() {
        await this.makeIdentityVerificationLink();
        this.initLink();
    }

    async makeLink() {

       
        let inputs = {
            ds_plaid  : "token-create",
            user_uuid : this.uuid
        };
        
        const rawResponse = await fetch(location.href, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(inputs)
        });
        
        const content = await rawResponse.json();
            
        this.linkToken = content.link_token;


        return content;
                    
    }


    async makeIdentityVerificationLink() {

       
        let inputs = {
            ds_plaid  : "token-create__identity-verification",
            user_uuid : this.requestId
        };
        
        const rawResponse = await fetch(location.href, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(inputs)
        });
        
        const content = await rawResponse.json();
  

        this.linkToken = content.link_token;
        this.requestId = content.request_id;
        
        return content;
                    
    }    

    

    getCookie(name) {
        
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();

        return false;
    }    


    async getIdentity(publicToken, accountID, linkSessionID = null) {                
       
        let inputs = {
            ds_plaid    : "get-identity",
            user_uuid   : this.uuid,
            publicToken : publicToken,
            accountID   : accountID,

        };

        if (linkSessionID && linkSessionID != false) {
            inputs = {
                ds_plaid    : "get-identity",
                user_uuid   : this.uuid,
                link_session_id : linkSessionID
            }
        }
        
        const rawResponse = await fetch(location.href, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(inputs)
        });
        
        const content = await rawResponse.json();
        this.launchCallBacks("identity", content);
        
        
        this.linkToken = content.link_token;

       // location.href = location.href;

        return content;  
    }


    async getAuth(publicToken, accountID) {
       
        let inputs = {
            ds_plaid    : "get-auth",
            user_uuid   : this.uuid,
            publicToken : publicToken,
            accountID   : accountID

        };
        
        const rawResponse = await fetch(location.href, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(inputs)
        });
        
        const content = await rawResponse.json();
        
        
        console.log("getAuth", content);
        this.launchCallBacks("auth", content);
        
        this.linkToken = content.link_token;

        //location.href = location.href;

        return content;  
    }

    listen(event, f) {
        this.callbacks[event].push(f);
    }

    launchCallBacks(event, content) {
        for (let i in this.callbacks[event]) {
            this.callbacks[event][i](content);
        }
    }

 
    async getIdentifiedPersondata() {

        let inputs = {
            ds_plaid     : "get-verified-identity",
            request_id   : this.requestId,
            link_session_id   : this.link_session_id,
            user_uuid : this.uuid
        };

    
        const rawResponse = await fetch(location.href, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(inputs)
        });
        
        const content = await rawResponse.json();

        this.launchCallBacks("identity", content);
 
        
    }

 
    initLink() {

        var self = this; 
        this.plaidHandler?.destroy?.();  
        this.plaidHandler = Plaid.create({
            token: this.linkToken, 
            onSuccess: (public_token, metadata) => {
                self.onSuccessStatus = 1;
                if (typeof metadata.link_session_id != "undefined" && typeof metadata.account_id == "undefined") {
                    
                    self.link_session_id = metadata.link_session_id;
                    self.getIdentifiedPersondata();                    
                                       
                }
                else {
                    self.getIdentity(public_token, metadata.account_id);
                    self.getAuth(public_token, metadata.account_id);
                }

                

                //console.log(["[plaidHandler.create.metadata.account_id"], public_token, metadata.account_id);
                //console.log(["[plaidHandler.create.onSuccess"], public_token, metadata);
            },
            onLoad: () => {
              
            },
            onExit: (err, metadata) => {
                console.log(["[plaidHandler.create.onExit"], err, metadata);

                self.launchCallBacks("exit", self.onSuccessStatus );
            },
                        
            onEvent: (eventName, metadata) => {
                console.log(["[plaidHandler.create.onEvent"], eventName, metadata);

                if (typeof self.callbacks[eventName] != "undefined") {
                    self.launchCallBacks(eventName, {eventName : eventName, metaData : metadata});
                } 
                
            },
        });   
        
        this.plaidHandler.open();
    }


 

    isPlaidContainer() {
        let nodes = document.querySelectorAll(".action__verify-identity");

        if (nodes.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isPlaidLibraryReady() {
        if (typeof Plaid != "undefined") {
            return true;
        }
        else {
            return false;
        }
    }
}


var  plaid = new DsPlaid();
setTimeout(function() {
    plaid.run();
}, 1000);

export default plaid;
