function OhmageAPI() {
    this.serverURL = "https://dev1.andwellness.org/";
    this.client = "phonegap";
    this.auth_path = "app/user/auth_token";
}

/*
requests an auth token (syncronously)
returns an object with the auth token and response
obj.result, obj.token
*/
OhmageAPI.prototype.authenticate = function (username, password) {
    this.username = username;
    this.password = password;

    /* do a http post request to get an auth token */    
    var postStr = "user=" + username + "&password=" + password + "&client=" + this.client;
    var req = new XMLHttpRequest();
    req.open("POST", this.serverURL + this.auth_path, false);
    req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    req.send(postStr);
    if (req.status == 200) {
        return JSON.parse(req.responseText);
    }
}

