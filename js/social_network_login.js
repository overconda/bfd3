
var oauth_ws = "https://singhabeerfinder.com/bfd2/webservice/oauth.php";
var facebook_appId = '371680153249243';
var instagram_clientId = '6e043e43278142898505e69f8f695ca5';
var instagram_callback = "https://singhabeerfinder.com/bfd2/";

/********************************
 * Facebook Login
 ********************************/
window.fbAsyncInit = function () {
  FB.init({
    appId: facebook_appId,
    cookie: true,
    xfbml: true,
    version: 'v2.8'
  });
  FB.AppEvents.logPageView();

  // FB.getLoginStatus(function(response) {
  //     if (response.status == "connected") {
  //         doFacebookAPI();
  //     }
  // });
};

/**
 * 
 * @returns {undefined}
 */
function facebookLogin() {
  FB.getLoginStatus(function (response) {
    if (response.status == "not_authorized" || response.status == "unknown") {
      FB.login(function (response) {
        // handle the response                    
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          doFacebookAPI();
        } else {
          // The person is not logged into this app or we are unable to tell. 
        }
      }, {scope: 'public_profile,email'});
    } else if (response.status == "connected") {
      doFacebookAPI();
    }
  });
}

/**
 * 
 * @returns {undefined}
 */
function facebookLogout() {
  FB.logout(function (response) {
    // Person is now logged out
    window.location.reload();
  });
}

/**
 * 
 * @returns {undefined}
 */
function doFacebookAPI() {
  FB.api('/me?fields=id,name,email,gender,first_name,last_name', function (response) {
    var params = {'platform': 'facebook', 'fb_data': response};
    $.post(oauth_ws, params, function (response) {
      console.log(response);
      if (response.oauth_user_id !== null || response.oauth_user_id !== undefined || response.oauth_user_id !== "") {
        setTimeout(function () {
          showTermsModal();
          saveUserData(response);
          //window.location.pathname = "/home.html";
        }, 1000);
      }
    });

  });
}

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/********************************
 * Twitter Login
 ********************************/
function twitterLogin() {
  var params = {'platform': 'twitter', 'method': 'get_request_token'};
  $.post(oauth_ws, params, function (response) {
    if (response.oauth_token !== undefined) {
      window.location = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + response.oauth_token;
    } else {
      alert('Twitter Authentication Failed');
    }
  });
}

$(document).ready(function () {
  oauth_token = getQueryVariable('oauth_token');
  oauth_verifier = getQueryVariable('oauth_verifier');
  if (oauth_token !== false && oauth_verifier !== false) {
    var params = {'platform': 'twitter', 'method': 'get_access_token'};
    params.oauth_token = oauth_token;
    params.oauth_verifier = oauth_verifier;

    $.post(oauth_ws, params, function (response) {
      console.log(response);
      if (response.oauth_user_id !== null || response.oauth_user_id !== undefined || response.oauth_user_id !== "") {
        setTimeout(function () {
          showTermsModal();
          saveUserData(response);
          //window.location.pathname = "/home.html";
        }, 1000);
      }
    });
  }
});

function getTwitterStatus() {}
function twitterAPI() {}


/********************************
 * Instagram Login   
 * 
 * Client-Side (Implicit) Authentication           
 *  
 * 1. [get token] 
 * https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code
 * 
 * 3. [call api] 
 * https://api.instagram.com/v1/users/self/?access_token=ACCESS-TOKEN
 *  
 ********************************/

function instagramLogin() {
  var client_id = instagram_clientId;
  var redirect_uri = encodeURI(instagram_callback);
  var login_url = "https://api.instagram.com/oauth/authorize/?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=token";
  window.location = login_url;
}

function getInstagramStatus() {}
function instagramAPI() {}

$(document).ready(function () {
  var access_token = getHashVariable('access_token');
  if (access_token !== false) {
    var url = 'https://api.instagram.com/v1/users/self/?access_token=' + access_token;
    var params = {'platform': 'instagram', 'url': url};
    $.post(oauth_ws, params, function (response) {
      console.log(response);
      if (response.oauth_user_id !== null || response.oauth_user_id !== undefined || response.oauth_user_id !== "") {
        setTimeout(function () {
          showTermsModal();
          saveUserData(response);
          //window.location.pathname = "/home.html";
        }, 1000);
      }
    });
  }
});

/**
 * 
 * @returns {undefined}
 */
function showTermsModal() {
  $('.modal').show();
}

/**
 * 
 * @param {type} user
 * @returns {undefined}
 */
function saveUserData(user) {
  setLocalStorage('sbf_user',user);
}

/**
 * 
 * @param {type} variable
 * @returns {getQueryVariable.pair|Boolean}
 */
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

/**
 * 
 * @param {type} variable
 * @returns {getHashVariable.pair|Boolean}
 */
function getHashVariable(variable) {
  var query = window.location.hash.substring(1);
  var vars = query.split("#");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}