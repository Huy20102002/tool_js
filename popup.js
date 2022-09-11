// if (getCookie("uid") !== null) {
// document.getElementById("login-form").style.visibility = 'hidden';
// document.getElementById("login-completed").style.visibility = 'visible';
// }
document.getElementById("go-to-home").href = host
popupInit();

document.getElementById("login-button").addEventListener("click", function (e) {
    popupLogin(e);
});
document.getElementById('username').onkeydown = function (e) {
    if (e.keyCode === 13) {
        popupLogin(e);
    }
};
document.getElementById('password').onkeydown = function (e) {
    if (e.keyCode === 13) {
        popupLogin(e);
    }
};

document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();
    popupLoginFormToggle(true)
    eraseCookie("uid");
    localStorage.removeItem("uid");
    chrome.storage.sync.set({'uid': null}, function () {
    });
});

function popupLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "" || password === "") {
        Swal.fire({
            icon: "error",
            title: 'Lỗi',
            text: "Vui lòng nhập tài khoản và mật khẩu.",
        });
        return
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", host + "/api/extension-login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onerror = () => {
        Swal.fire({
            icon: "error",
            title: 'Lỗi!',
            text: "Lỗi...",
        });
    };
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.response);
            if (xhr.status !== 200) {
                Swal.fire({
                    icon: "error",
                    title: 'Lỗi!',
                    text: response.message,
                });
                return
            }
            setCookie("uid", response["access_token"], 365 * 20);
            localStorage.setItem("uid", response["access_token"]);
            chrome.storage.sync.set({'uid': localStorage.getItem('uid')}, function () {
            });
            Swal.fire({
                icon: "info",
                title: 'Thông báo',
                text: "Đăng nhập thành công!",
            }).then(function () {
                popupLoginFormToggle(false)
            });
        }
    }
    xhr.send(JSON.stringify({
        username: username,
        password: password,
    }));
}

function popupInit() {
    popupLoginFormToggle(!isLogged())
}

function popupLoginFormToggle(showForm) {
    if (showForm) {
        document.getElementById("login-form").classList.remove('d-none');
        document.getElementById("login-completed").classList.add('d-none');
    } else {
        document.getElementById("login-form").classList.add('d-none');
        document.getElementById("login-completed").classList.remove('d-none');
    }
}
