<?php 
namespace DS_Plaid;

class Link {
    function __construct($Plaid, $settings) {
        $this->Plaid = $Plaid;
        $this->settings = $settings;
    }


    function tokenCreateAction($user_id) {

        $data = [
            "user" => [
                "client_user_id" => $user_id, 
            ],
            "client_name" => "Plaid Plugin Demo",
            "products"=> ["identity", "auth"],
            "country_codes"=> ["CA"],
            "language"=> "en",            
            "webhook"=>  $this->getWebhook(),
            "redirect_uri"=>$this->getTokenCreateRedirectURI(),
            "update" => [ "account_selection_enabled" =>true ]
       ]; 

       
        
        $out = $this->Plaid->curl("/link/token/create", $data);
       
        return $out;
    }

    function createTokenIdentityVerificationAction($user_id) {

        $data = [
            "user" => [
                "client_user_id" => $user_id, 
            ],
            "client_name" => "Plaid Plugin Demo",
            "products"=> ["identity_verification"],
            "country_codes"=> ["CA"],
            "language"=> "en",            
            "webhook"=>  $this->getWebhook(),
            "redirect_uri"=>$this->getTokenCreateRedirectURI(),
            "update" => [ "account_selection_enabled" =>true ],
            "identity_verification" => [
                "template_id" => PLAID_VERIFICATION_TEMPLATE_ID,
            ]            
       ]; 
        
        
        $out = $this->Plaid->curl("/link/token/create", $data);

        $_SESSION["link_token"] = $out;
       
        return $out;  
    }


    function getWebhook() {
        $url = "https://" . $_SERVER['HTTP_HOST'] . "?ds_plaid=tokenCreateWebhook";

        return $url;
    }

    function getTokenCreateRedirectURI() {
        $url = "https://" . $_SERVER["HTTP_HOST"] . "/". $this->settings["tokenCreate_RedirectUri"];

        return $url;
    }
    

 
}
?>