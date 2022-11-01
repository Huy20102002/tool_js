$(document).ready(function () {
    ready();
});

function setZIndex() {
    setTimeout(function () {
        try {
            $('#detail').css('z-index', 100);
            var layouts = document.getElementsByClassName('layout');
            for (let i = 0; i < layouts.length; i++) {
                layouts[i].style.zIndex = 100;
            }
            $('#J_TabBarWrap').css('z-index', 100);
        } catch (e) {
            setZIndex();
        }
    }, 1000);
}

function ready() {
    const appendage = document.createElement("div");
    appendage.className = "_appendage";
    appendage.style = "display: block;";
    document.body.insertBefore(appendage, document.body.childNodes[0]);
    const url = window.location.href;
    if (url.match(/datn.order-taobao.com\/home/)) {
        chrome.storage.sync.set({'sid': localStorage.getItem('sid'), 'uid': localStorage.getItem('uid')}, function () {
            console.log(localStorage.getItem('uid'), localStorage.getItem('sid'));
        });
    }
    if (!(match("taobao") || match("tmall"))) return;
    chrome.runtime.sendMessage({
        action: "getAppendage",
        callback: "afterGetAppendage"
    });
    if (match("taobao")) {
        setZIndex();
        item_taobao_loaded();
    } else if (match("tmall")) {
        detail_tmall_loaded();
    }
}

function loadAppendage() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function (evt) {
        if (req.readyState === 4 && req.status === 200) {
            if (req.responseText === null) return;
            document.getElementsByClassName("_appendage")[0].innerHTML = req.responseText;
            loadScript();
        }
    };
    req.open("GET", chrome.runtime.getURL("template/index.html"), true);
    req.setRequestHeader("Content-type", "text/html");
    req.send();
}

function loadScript() {
    var tool = getToolGetter();


    var map = {};

    $(document).on("click", ".btn_add_to_cart", function () {
        if (match("taobao") || match("tmall")) {
            if (!tool.isFull()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Quý khách vui lòng chọn đầy đủ thuộc tính của sản phẩm',
                    customClass: 'notranslate'
                });
                return
            }
        }

        if (document.getElementsByTagName('html')[0].getAttribute('lang') === 'vi'
            || $(".translated-ltr")[0]
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'vui lòng tắt google dịch trước khi đặt hàng',
                customClass: 'notranslate'
            });
            return
        }
        chrome.storage.sync.get(['sid', 'uid'], function (result) {
            const uid = result.uid;
            // const sid = result.sid;
            if (uid === null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Bạn chưa đăng nhập vui lòng đăng nhập trước',
                    // confirmButtonText: 'đăng nhập'
                }).then(function () {
                    // var win = window.open(host + "/login", '_blank');
                    // win.focus();
                });
                return
            }

            const data = tool.getData();
            if (data['properties_id'] === 'undefined') {
                alert("xin vui lòng chọn màu của sản phẩm");
                return
            }

            map[data['properties_id']] = data;

            let time = 0;
            order_count = Object.keys(map).length;

            if (order_count === 0) {
                alert("xin vui lòng chọn sản phẩm cần mua");
                return;
            }
            
            Object.keys(map).forEach(function (key, index) {
                if (index == Object.keys(map).length-1) {
                    setTimeout(function () {
                        let xhr = new XMLHttpRequest();
                        xhr.open("POST", host + "/api/create-cart", true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Accept', 'application/json');
                        xhr.setRequestHeader('Authorization', 'Bearer ' + uid);
                        xhr.send(JSON.stringify({
                            data: JSON.stringify(map[key])
                        }));
                        // console.log(JSON.stringify(map[key]))
                        xhr.onreadystatechange = function (oEvent) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Thông báo',
                                        text: 'đặt hàng thành công',
                                        footer: '<a href="https://datn.order-taobao.com/">Mở giỏ hàng</a>',
                                        customClass: 'notranslate'
                                    });
                                } else {
                                    try {
                                        let res = JSON.parse(xhr.responseText);
                                        let message = "Lỗi";
                                        if (typeof res.message != "undefined") {
                                            message = res.message;
                                        }
                                        Swal.fire({
                                            icon: "error",
                                            title: 'Lỗi!',
                                            text: message,
                                        });
                                    } catch (e) {
                                        Swal.fire({
                                            icon: "error",
                                            title: 'Lỗi!',
                                            text: "Lỗi...",
                                        });
                                    }
                                }
                            }
                        };
                    }, time);
                    time += 100;
                }
            });
        });
    });
}

var order_count = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "afterGetAppendage") {
        loadAppendage();
    }
    else if (request.action === "afterCreateCart") {
        
    } else if (request.action === "orderSuccess") {
        order_count = order_count - 1 <= 0 ? 0 : order_count - 1;
        if (order_count === 0) {
            Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'đặt hàng thành công',
                footer: '<a href="https://datn.order-taobao.com/">mở giỏ hàng</a>',
                customClass: 'notranslate'
            });
        }

    } else if (request.action === "orderError") {
        if (request.message === 'chưa đăng nhập vui lòng đăng nhập') {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: request.message,
                confirmButtonText: 'đăng nhập',
                customClass: 'notranslate'
            }).then(function () {
                var win = window.open(host + "/login", '_blank');
                win.focus();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: request.message,
                customClass: 'notranslate'
            })
        }
    } else if (request.action === "loginBeforeOrdering") {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: "Vui lòng đăng nhập trước khi đặt hàng!",
            customClass: 'notranslate'
        });
    }
});
