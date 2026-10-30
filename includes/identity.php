<?php 
namespace DS_Plaid;

class Identity {
    function __construct($Plaid) {
        $this->Plaid = $Plaid;
    }


    function getIdentity($accessToken) {

        $data = [
          "access_token" => $accessToken
       ]; 
        
                

        $out = $this->Plaid->curl("/identity/get", $data);
       
        return $out;
    }


    function isValidated() {

        if (!empty($_COOKIE["user_uuid"])) {
            global $wpdb;
            
            $result = $this->findByUUID($_COOKIE["user_uuid"]);
            if ($result == false) {
                return false;
            }
            
            $identity_json = json_decode($result["identity_json"], 1);

            print_r($identity_json);
            
            if (!empty($identity_json["accounts"])) {
                return true;
            }
            else {
                return false;
            }
        }

        return false;

    }


    function isVerified($uuid = false, $userID = false) {

        if (empty($uuid) AND empty($userID)) {
            return false;
        }

        if (empty($userID) AND !empty($uuid)) {
            $plaid_identity = $this->findByUUID($uuid);
        }
        else
        if (!empty($userID)) {
            $plaid_identity = $this->findByUserID($uuid);       
        }

        if (!empty($plaid_identity["identity_json"]) AND !empty($plaid_identity["identity_json"]["accounts"]["owners"])) {
            
            return true;
        }
        else {
            return false;
        }        
    }


    function save($args) {

        global $wpdb;

        if (empty($args["uuid"]))
            return false;

        $plaid_identity = $this->findByUUID($args["uuid"]);

        $fields = [
            "plaid_access_token", "plaid_public_token","identity_json", "uuid"
        ];

        foreach ($fields as $field) {
            $insert[$field] = $args[$field];
        }

        if ($plaid_identity === false) {
            $insert["create_time"]      = time();
            $insert["create_time_str"]  = date("Y-m-d H:i:s", $insert["create_time"]);
            
            $insert["update_time"]      = $insert["create_time"];
            $insert["update_time_str"]  = $insert["create_time_str"];
            
            $wpdb->insert( 'plaid_identity',$insert);
        }
        else {

            foreach ($insert as $k => $v) {
                $plaid_identity[$k] = $v;
            }

            $insert["update_time"] = time();
            $insert["update_time_str"] = date("Y-m-d H:i:s", $insert["update_time"]);

            $wpdb->update( 'plaid_identity',$insert, array( 'ID' => $result["id"] ) ); 
        }
    }


    function findByUUID($uuid) {
        if (empty($uuid)) {
            return false;
        }

        global $wpdb;

        $result = $wpdb->get_row( $wpdb->prepare("SELECT * FROM plaid_identity WHERE uuid=%s",[$uuid]), "ARRAY_A" );

        if (empty($result)) {
            return false;
        }
        else {
            return $result;
        }

    }

    function findByUserID($userID) {
        if (empty($userID)) {
            return false;
        }

        global $wpdb;

        $result = $wpdb->get_row( $wpdb->prepare("SELECT * FROM plaid_identity WHERE user_id=%s",[$userID]), "ARRAY_A" );

        if (empty($result)) {
            return false;
        }
        else {
            return $result;
        }
    }
 
}
?>