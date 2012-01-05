function OhmageAPI() {
    this.serverURL = "https://dev.andwellness.org/";
    this.client = "phonegap";
    this.auth_path = "app/user/auth";
    this.surveyUploadPath = "app/survey/upload";
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
requests an authorization (asyncronously), and allows for hashed password
to be saved for later use
@param username string
@param password string
@param callback function(responseObject) function to be executed when request is done
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
            parentObj.hashedPassword = obj.hashed_password;
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
@param surveys an array of survey objects (not json, real objects)
*/
OhmageAPI.prototype.surveyUpload = function(campaignUrn, campaignCreationTimestamp, surveys, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            callback(JSON.parse(this.responseText));
        }
    }

    var postStr = "user=" + this.username + "&password=" + this.hashedPassword + "&client=" + this.client;
    postStr += "&campaign_urn=" + campaignUrn + "&campaign_creation_timestamp=" + campaignCreationTimestamp;
    postStr += "&surveys=" + JSON.stringify(surveys);


    req.open("POST", this.serverURL + this.surveyUploadPath);
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    req.send(postStr);
}

/* Mobility Upload */
