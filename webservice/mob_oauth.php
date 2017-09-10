<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methodhs: GET, POST, PUT');

require_once 'database.php';

define("TWITTER_CONSUMER_SECRETE","dDOOHGhUngjdnNr1pFDCGk6asVfaai4FgSlAo89wgwsLuAjJtR");
define("TWITTER_CONSUMER_KEY","TaPR4ZpfTewzAhui0aqFQHb5E");
define("TWITTER_CALLBACK","https://singhabeerfinder.com/bfd2/");

/**
 * OAuth wrapper
 * 1. collection protocol_parameter
 * 2. key sorting array protocol_parameter - ksort() 
 * 3. encode key and value array protocol_parameter - rawurlencode()
 * 4. create protocol_parameter_string - key=value&key2=value2.....
 * 5. encode protocol_parameter_string - rawurlencode()
 * 6. encode request_uri - rawurlencode() 
 * 7. create signature base string - POST&request_uri&protocal_parameter_string
 * 8. encode oauth_consumer_secrete and oauth_token
 * 9. create key string for hash_hmac - oauth_consumer_secrete&oauth_token_secret
 * 10. create oauth_signature with hash_hmac and base64_encode
 * 11. add oauth_signature to protocal_parameter and ksort()
 * 12. create authorization_header - key="value",key2="value2".....
 * 
 * https://tools.ietf.org/html/rfc5849#section-3.4.1
 */

/**
 * 
 * generateOAuthSignature
 * 
 * @param type $request_uri
 * @param type $protocol_parameter
 * @param type $http_protocol
 * @param type $oauth_consumer_secret
 * @param type $oauth_token
 * @param type $oauth_token_secret
 * @return string
 */
function generateOAuthSignature($request_uri, $protocol_parameter, $http_protocol, $oauth_consumer_secret, $oauth_token_secret = "") {
    ksort($protocol_parameter);
    foreach ($protocol_parameter as $key => $value) {
        $protocol_parameter[$key] = rawurlencode($value);
    }
    $protocol_parameter_string = "";
    $index = 0;
    foreach ($protocol_parameter as $key => $value) {
        $protocol_parameter_string .= "{$key}={$value}";
        $index++;
        if ($index < count($protocol_parameter)) {
            $protocol_parameter_string .= "&";
        }
    }
    $signature_base_string = "{$http_protocol}&" . rawurlencode($request_uri) . "&" . rawurlencode($protocol_parameter_string);
    $key = rawurlencode($oauth_consumer_secret) . "&" . rawurlencode($oauth_token_secret);
    $oauth_signature = base64_encode(hash_hmac('sha1', $signature_base_string, $key, TRUE));
    $protocol_parameter['oauth_signature'] = rawurlencode($oauth_signature);
    ksort($protocol_parameter);

    $authorization_header = "OAuth ";
    $index = 0;
    foreach ($protocol_parameter as $key => $value) {
        $authorization_header .= "{$key}=\"{$value}\"";
        $index++;
        if ($index < count($protocol_parameter)) {
            $authorization_header .= ",";
        }
    }

    return $authorization_header;
}

/**
 * doRequest
 * 
 * @param type $request_uri
 * @param type $http_protocol
 * @param type $authorization_header
 */
function doRequest($request_uri, $http_protocol, $authorization_header, $postvars = array()) {
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $request_uri,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $http_protocol,
        CURLOPT_POSTFIELDS => http_build_query($postvars),
        CURLOPT_HTTPHEADER => array(
            "authorization: {$authorization_header}",
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        die("cURL Error #:" . $err);
    } else {
        return $response;
    }
}

/**
 * TwitterAuth Class
 */
class TwitterAuth {
    /*
     * Twitter OAuth
     * 
     * 1. get request token -> oauth_token, oauth_token_secret, oauth_callback_confirmed
     * 2. redirect user to twitter oauth screen - https://api.twitter.com/oauth/authenticate?oauth_token=?
     * 3. received oauth_verifier 
     * 4. get access token -> oauth_token, oauth_token_secret, user_id, screen_name
     * 5. ready call api
     */

    public function __construct() {
        $this->http_protocol = "POST";
        $this->request_uri = "https://api.twitter.com/oauth/request_token";
        $this->oauth_consumer_secret = TWITTER_CONSUMER_SECRETE;

        $this->protocol_parameter = array(
            "oauth_callback" => TWITTER_CALLBACK,
            "oauth_consumer_key" => TWITTER_CONSUMER_KEY,
            "oauth_signature_method" => "HMAC-SHA1",
            "oauth_timestamp" => time(),
            "oauth_nonce" => time(),
            "oauth_version" => "1.0",
        );
    }

    /**
     * Get twiiter request_token
     * @return type
     */
    public function getRequestToken() {
        $this->http_protocol = "POST";
        $this->request_uri = "https://api.twitter.com/oauth/request_token";
        $authorization_header = generateOAuthSignature($this->request_uri, $this->protocol_parameter, $this->http_protocol, $this->oauth_consumer_secret);
        return doRequest($this->request_uri, $this->http_protocol, $authorization_header);
    }

    /**
     * Get twitter access_token
     * @param type $oauth_token
     * @param type $oauth_verifier
     * @return type
     */
    public function getAccessToken($oauth_token, $oauth_verifier) {
        $this->http_protocol = "POST";
        $this->request_uri = "https://api.twitter.com/oauth/access_token";
        $protocol_parameter = $this->protocol_parameter;
        $protocol_parameter["oauth_token"] = $oauth_token;
        $authorization_header = generateOAuthSignature($this->request_uri, $protocol_parameter, $this->http_protocol, $this->oauth_consumer_secret);
        $postvars = array("oauth_verifier" => $oauth_verifier);
        return doRequest($this->request_uri, $this->http_protocol, $authorization_header, $postvars);
    }

    /**
     * Get twitter profile
     * @param type $access_token
     * @return type
     */
    public function getProfile($access_token) {
        $this->http_protocol = "GET";
        $request_uri = "https://api.twitter.com/1.1/account/verify_credentials.json";
        $protocol_parameter = $this->protocol_parameter;
        $protocol_parameter["oauth_token"] = $access_token['oauth_token'];
        $authorization_header = generateOAuthSignature($request_uri, $protocol_parameter, $this->http_protocol, $this->oauth_consumer_secret, $access_token['oauth_token_secret']);
        return doRequest($request_uri, $this->http_protocol, $authorization_header);
    }
}

/**
 * insertOrUpdateUserOAuth
 * 
 * @param type $data
 * @return type
 */
function insertOrUpdateUserOAuth($data) {
    $database = new Database();
    $oauth_user_id = $data['oauth_user_id'];
    $sql = "SELECT ID FROM sbfdm_oauth WHERE oauth_user_id='{$oauth_user_id}'";
    $result = $database->query($sql);

    if ($result->num_rows > 0) {
        // update
        while ($row = $result->fetch_assoc()) {
            $ID = $row['ID'];
            unset($data['platform']);
            unset($data['user_id']);
            unset($data['user_name']);
            unset($data['user_email']);
            unset($data['oauth_user_id']);
            $set = "";
            $index = 0;
            foreach ($data as $field => $value) {
                $set .= "{$field}='{$value}'";
                $index++;
                if ($index < count($data))
                    $set .= ",";
            }
            $sql = "UPDATE sbfdm_oauth SET {$set} WHERE ID={$ID}";
            $database->query($sql);
        }
    } else {
        // insert
        $field = implode(",", array_keys($data));
        $value = "'" . implode("','", array_values($data)) . "'";
        $sql = "INSERT INTO sbfdm_oauth($field) VALUES({$value})";
        $database->query($sql);
    }

    $sql = "SELECT * FROM sbfdm_oauth WHERE oauth_user_id='{$oauth_user_id}'";
    $result = $database->query($sql);
    while ($row = $result->fetch_assoc()) {
        return $row;
    }
}

/**
 * Main Program
 */
if ($_POST['platform'] == "twitter") {
    $twitter = new TwitterAuth();
    if ($_POST['method'] == "get_request_token") {
        $response = $twitter->getRequestToken();
        parse_str($response, $request_token);
        header('Content-Type: application/json');
        echo(json_encode($request_token));
    } else if ($_POST['method'] == "get_access_token") {
        $response = $twitter->getAccessToken($_POST['oauth_token'], $_POST['oauth_verifier']);
        parse_str($response, $access_token);
        $response = $twitter->getProfile($access_token);
        /**
         * $response['id']
         * $response['name']
         * $response['screen_name']
         * $response['profile_image_url_https']
         * $response['email']
         */
        $response = json_decode($response, TRUE);
        $result = array();
        if (isset($response['id'])) {
            $data = array();
            $data["platform"] = "twitter";
            $data["user_id"] = $response['id'];
            $data["user_name"] = $response['name'];
            $data["user_email"] = (isset($response['email'])) ? $response['email'] : "";
            $data["user_profile_photo"] = str_replace("_normal", "", $response['profile_image_url_https']);
            $data["oauth_user_id"] = "tw_{$response['id']}";
            $data["oauth_token"] = $access_token["oauth_token"];
            $data["oauth_token_secret"] = $access_token["oauth_token_secret"];
            $result = insertOrUpdateUserOAuth($data);
        }
        header('Content-Type: application/json');
        echo(json_encode($result));
    }
} else if ($_POST['platform'] == "facebook") {
    $fb_data = $_POST['fb_data'];

    /**
     * $fb_data['id']
     * $fb_data['name']
     * $fb_data['email']
     * $fb_data['gender']
     * $fb_data['first_name']
     * $fb_data['last_name']
     */
    $result = array();
    $data = array();
    $data["platform"] = "facebook";
    $data["user_id"] = $fb_data['id'];
    $data["user_name"] = $fb_data['name'];
    $data["user_email"] = (isset($fb_data['email'])) ? $fb_data['email'] : "";
    $data["user_profile_photo"] = "https://graph.facebook.com/{$fb_data['id']}/picture?type=large";
    $data["oauth_user_id"] = "fb_{$fb_data['id']}";
    $data["oauth_token"] = "";
    $data["oauth_token_secret"] = "";
    $result = insertOrUpdateUserOAuth($data);

    header('Content-Type: application/json');
    echo(json_encode($result));
} else if ($_POST['platform'] == "instagram") {
    $url = $_POST['url'];
    $response = file_get_contents($url);
    $response = json_decode($response, TRUE);
    $ig_data = $response["data"];

    /**
     * $ig_data['id']
     * $ig_data['username']
     * $ig_data['profile_picture']
     * $ig_data['full_name']
     * 
     */
    $result = array();
    $data = array();
    $data["platform"] = "instagram";
    $data["user_id"] = $ig_data['id'];
    $data["user_name"] = $ig_data['username'];
    $data["user_email"] = "";
    $data["user_profile_photo"] = $ig_data['profile_picture'];
    $data["oauth_user_id"] = "ig_{$ig_data['id']}";
    $data["oauth_token"] = "";
    $data["oauth_token_secret"] = "";
    $result = insertOrUpdateUserOAuth($data);

    header('Content-Type: application/json');
    echo(json_encode($result));
}