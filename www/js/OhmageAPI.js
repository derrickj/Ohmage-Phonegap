function OhmageAPI() {
    this.serverURL = "https://dev.andwellness.org/";
    this.client = "phonegap";
    this.auth_path = "app/user/auth_token";
}

/* set's server url
@param serverURL string
*/
OhmageAPI.prototype.setServerURL = function(serverURL) {
    if (serverURL.charAt(serverURL.length - 1) != '/') {
        this.serverURL = serverURL.concat("/");
    } else {
        this.serverURL = serverURL;
    }
}

/*
requests an auth token (asyncronously)
@param username string
@param password string
@param callback function(responseObject)
 object is in form: obj.result, obj.token
*/
OhmageAPI.prototype.authenticate = function (username, password, callback) {
    this.username = username;
    this.password = password;

    /* do a http post request to get an auth token */    
    var postStr = "user=" + username + "&password=" + password + "&client=" + this.client;
    var req = new XMLHttpRequest();

    /* save parent object to pass into handler, because want to save hashed password there*/
    var parentObj = this;
    req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            parentObj.hashedPassword = obj.token;
            callback(JSON.parse(this.responseText));
        }
    }
    req.open("POST", this.serverURL + this.auth_path, true);
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    req.send(postStr);
}

/*
upload survey
@param campaignUrn string found in xml campaign config
@param campaignCreationTimestamp string in the form YYYY-MM-DD HH:mm:ss
@param surveys (an arry of surveys)
*/
OhmageAPI.prototype.surveyUpload = function(campaignUrn, campaignCreationTimestamp, surveys) {
    //TODO
}

/* Mobility Upload */