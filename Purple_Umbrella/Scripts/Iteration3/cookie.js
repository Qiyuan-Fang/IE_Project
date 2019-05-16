
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie() {
    var _uuid = "uuid" + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(_uuid) === 0) {
            return c.substring(_uuid.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var uuid = getCookie("uuid");
    if (uuid !== "") {
        return uuid;
    } else {
        initiateCookie();
        $('#intro-modal').modal({ show: true });
        //user = createUuid();
        //user = prompt("Please enter your name:", "");
        //setCookie("username", user, 30);
        //if (user != "" && user != null) {
            
        //}
    }
}

function initiateCookie() {
    var uuid = createUuid();
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toGMTString();
    document.cookie = "uuid" + "=" + uuid + ";" + expires + ";path=/";
}


$(function () {
    var ck = getCookie();
    document.getElementById("user-cookie").value = ck;
    //$('#user-cookie').innerText(ck);
});

//Create unique cookie for user
function createUuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
