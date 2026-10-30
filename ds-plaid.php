<?php
/**
 * Plugin Name: DS Plaid
 * Description: Plaid user id verification
 * Version: 1.0
 * Author: Dmytro Shatalov
 * Author URI: https://dshatalov.com
 */

require_once plugin_dir_path( __FILE__ ) . 'autoload.php';


use  \DS_Plaid\Plaid;
use  \DS_Plaid\Identity;
use  \DS_Plaid\Link;
use  \DS_Plaid\Token;
use  \DS_Plaid\Auth;
use  \DS_Plaid\Verified_Identity;

if (session_status() === PHP_SESSION_NONE) {
    session_start();


    //$_SESSION["plaid_doc_verified"]
}




class DS_Plaid  {
    function __construct($settings) {
        $this->Plaid        = new Plaid($settings);
        $this->PlaidLink    = new Link($this->Plaid, $settings);
        $this->Identity     = new Identity($this->Plaid);
        $this->Token        = new Token($this->Plaid);
        $this->Auth         = new Auth($this->Plaid);
        $this->Verified_Identity = new Verified_Identity($this->Plaid);


        $this->requestData = false;
    }

    function subscribe_link(){
        return 'Follow us on <a rel="nofollow" href="https://www.facebook.com/ThemeXpert/">Facebook</a>';
    }
    

    public function javascript() {
        
  
       wp_enqueue_script( 'plaid_link_int', "https://cdn.plaid.com/link/v2/stable/link-initialize.js",[],null, true );
        wp_enqueue_script( 'plaid_link_int' );        

        wp_enqueue_script( 'plaid', plugins_url( 'ds-plaid/js/ds-plaid.js' ),[], time(), false );
        wp_enqueue_script( 'plaid' );

        wp_enqueue_script( 'ds_code_helpers', plugins_url( 'ds-code-helpers/js/dist/ds-code-helpers.js' ),[],false, true );
         wp_enqueue_script( 'ds_code_helpers' );
    }

    function init() {


        $this->javascript();

        $json = file_get_contents('php://input');
        $this->rData = json_decode($json, 1);          
        
        $this->routing();
    }


    function getUserUUID() {
        global $SessionsService;
   
        return $SessionsService->get_user_uuid();
    }

    function generateUniqueUUID() {
        return wp_generate_uuid4();
    }    

    function getUserID() {
        $user = json_decode(json_encode(wp_get_current_user()), 1);

        if (empty($user["ID"]))
            return false;
        else {
            return $user["ID"];
        }        
    }

    function isVerified() {
        $this->Identity->isVerified($this->getUserUUID(), $this->getUserID());
    }

    function routing() {

       global $SessionsService;

        if (!isset($this->rData["ds_plaid"])) {
            return false;
        }

        if (empty($this->getUserUUID())) {

            echo json_encode(["status" => "Cookies are turned off"]);
            return false;
        }
        //VerifiedIdentity
        if ($this->rData["ds_plaid"] == "token-create" AND !empty($this->getUserUUID())) {

            $this->isEmailVerified();

            $linkToken = $this->PlaidLink->tokenCreateAction($this->getUserUUID());

            echo json_encode($linkToken);
            exit();
        }

        else        
        if ($this->rData["ds_plaid"] == "token-create__identity-verification" AND !empty($this->getUserUUID())) {

            $this->isEmailVerified();

            $linkToken = $this->PlaidLink->createTokenIdentityVerificationAction($this->getUserUUID());

            echo json_encode($linkToken);
            exit();
        }
        else 
        if ($this->rData["ds_plaid"] == "get-verified-identity" AND !empty($this->rData["link_session_id"])) {

            $this->isEmailVerified();


            // Second argument is for fake data user, default is true
            $out = $this->Verified_Identity->getData($this->rData["link_session_id"], TEST__VALIDATE_DOCUMENT);

            if (empty($out["user_name"])) {

                echo json_encode(["status"=>"error"]);
                exit();
            }
            
            $SessionsService->set_verified_plaid_identity($out);
  

            $filtered = [
                "user_name" => $out["user_name"],
                "phone"     => $out["phone"]
            ];


            if (TEST__VALIDATE_DOCUMENT == false) {
                $customer_name = $SessionsService->get_customer_name();
                if (!empty($customer_name)) {
                    if ($customer_name== $out["user_name"]["last_name"] . " " . $out["user_name"]["first_name"]) {
                        //if (TEST__DISPLAY_NAME_MA)
                      //  $filtered["name_match"] =  $customer_name ."==". $out["user_name"]["last_name"] . " " . $out["user_name"]["first_name"];
                    }
                    else {
                    echo json_encode(["status"=>"error", "error_slug" => "invalid_name"]);
                    exit(); 
                    }
                }
                else
                if ( empty($SessionsService->get_verified_email()) ) { 
                    $SessionsService->clean_all_checkout();
                    echo json_encode(["status"=>"error", "error_slug" => "session_expire"]);
                    exit();
                }

            }

            echo json_encode($filtered);
            exit();
        }
        else 
        if ($this->rData["ds_plaid"] == "get-auth" AND !empty($this->rData["publicToken"])) {

            $this->isEmailVerified();

            $SessionsService->set_plaid_account(null);
             

            $accessToken = $this->Token->publicTokenToAccess($this->rData["publicToken"]);   

            $accounts = $this->Auth->getAccount($accessToken["access_token"]);

            if (empty( $accounts)) {
                echo json_encode(["status"=>"422"]);
            }
            else {

                $SessionsService->set_plaid_account($accounts);
               
                echo json_encode(["status"=>"200", "msg" => "session", "institution_name" => $accounts["item"]["institution_name"] ?? ""
                , "account_name" => $accounts["accounts"][0]["name"] ?? "" 
                 ]);
            }
            

            
            exit();
        }
        else 
        if ($this->rData["ds_plaid"] == "get-identity" AND !empty($this->rData["publicToken"])) {

            $this->isEmailVerified();

            $SessionsService->set_plaid_identity(null);
            
            $accessToken = $this->Token->publicTokenToAccess($this->rData["publicToken"]);            

            $identity = $this->Identity->getIdentity($accessToken["access_token"]);
     

            if (empty($identity)) {
                echo json_encode(["status" => "422"]);
            }
            else {
                
                 $SessionsService->set_plaid_identity($identity);
                echo json_encode(["status" => "200", "msg" => "session"]);
            }
            exit();
        }
    }

    function ds_plaid_view() {

       

       include("templates/verify.php");
    }


    function isEmailVerified() {
        global $SessionsService;

        if (TEST__VALIDATE_DOCUMENT == true) {
            return true;
        }

        if (empty( $SessionsService->get_verified_email() )) { 
            
            $SessionsService->clean_all_checkout();

            echo json_encode(["status"=>"error", "error_slug" => "session_expire"]);
            exit();
        }
        else {
            return true;
        }
    }
    
}





$settings = [
    "client_id"     => PLAID_CLIENT_ID,
    "secret"        => PLAID_SECRET,
    "template_id"   => "template_id",
    "tokenCreate_RedirectUri"  => "shop-checkout"
];
$DS_Plaid = new DS_Plaid($settings);


add_shortcode('ds-plaid', [$DS_Plaid, "ds_plaid_view"]); 


add_action( 'init', [$DS_Plaid, "init"]);

 
?>