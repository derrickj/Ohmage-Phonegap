function OhmageAPI() {
    this.serverURL = "https://dev.mobilizingcs.org/";
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
this is currently targeted at server version 2.9
*/
OhmageAPI.prototype.surveyUpload = function(campaignUrn, campaignCreationTimestamp, surveys, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            var responseObj = JSON.parse(this.responseText);
            callback(responseObj);
        }
    }

    req.open("POST", this.serverURL + this.surveyUploadPath);
    var boundary = "----------------------------897a53c299a7"; //FIXME: better boundary
    req.setRequestHeader("Content-Type","multipart/form-data; Boundary=" + boundary);
    var fieldStr = function(name, value) {
        return "--" + boundary + '\r\n'
            + 'content-disposition: form-data; name="' + name + '"\r\n\r\n'
            + value + '\r\n';
    }

    var postStr = "";
    postStr += fieldStr("user", this.username);
    postStr += fieldStr("password", this.hashedPassword);
    postStr += fieldStr("client", this.client);
    postStr += fieldStr("campaign_urn", campaignUrn);
    postStr += fieldStr("campaign_creation_timestamp", campaignCreationTimestamp);
    postStr += fieldStr("surveys", JSON.stringify(surveys));

    postStr += "--" + boundary + "--\r\n";


    req.setRequestHeader("charset", "utf-8");
    req.setRequestHeader("Content-Length", postStr.length);

    req.send(postStr);
}


/* Mobility Upload */


/* helpers */
OhmageAPI.prototype.rfc4122uuid = function () {
    /* code shamelessly copy/pasted from stackoverflow discussion.
    http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    */
    var uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    return uuid;
}
