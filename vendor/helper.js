function httpAsync(method, theUrl, callback) {
    const request = createCORSRequest(method, host + theUrl);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = () => {
        // callback(request.responseText)
    };

    request.onreadystatechange = function (ev) {
        // callback(ev)
    };
    request.onerror = () => {
        // console.log('Error');
        Swal.fire({
            icon: "error",
            title: 'Lỗi!',
            text: "Lỗi...",
        });
    };
    request.send();
}

function createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function setCookie(key, value, expiry) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function eraseCookie(key) {
    var keyValue = getCookie(key);
    setCookie(key, keyValue, '-1');
}

function isLogged() {
    return !!getCookie("uid")
    // return !!localStorage.getItem("uid");
}