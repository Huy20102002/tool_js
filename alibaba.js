function getOriginPrice() {
    try {
        var tmp = $("#J_StrPrice");
        var origin = tmp.find(".tm-price");
        if (origin == null || origin.length === 0) origin = tmp.find(".tb-rmb-num");
        if (origin == null || origin.length === 0) origin = $("#J_priceStd").find(".tb-rmb-num");
        if (origin == null || origin.length === 0) origin = $("#J_priceStd").find(".tm-price");
        if (origin == null || origin.length === 0) origin = $("#J_StrPriceModBox").find(".tm-price");
        if (origin == null || origin.length === 0) origin = $("#J_StrPriceModBox").find(".tb-rmb-num");
        if (origin == null || origin.length === 0) origin = $("#J_PromoPrice").find(".tm-price");
        if (origin == null || origin.length === 0) origin = $("#J_PromoPrice").find(".tb-rmb-num");
        return origin.text().match(/[0-9]*[.,]?[0-9]+/g);
    } catch (k) {
        throw Error(k.message + " Can't get origin price function getOriginPrice")
    }
}

function getPromoPrice() {
    var price_box = document.getElementById("J_PromoPrice");
    if (price_box === null) price_box = document.getElementById("J_StrPriceModBox");
    let promo_price = 0;
    if (price_box != null) {
        try {
            const tm_price = price_box.getElementsByClassName("tm-price");
            const tb_rmb_num = price_box.getElementsByClassName("tb-rmb-num");
            if (tm_price.length > 0) {
                promo_price = tm_price[0].textContent.match(/[0-9]*[.,]?[0-9]+/g);
            } else if (tb_rmb_num.length > 0) {
                promo_price = tb_rmb_num[0].textContent.match(/[0-9]*[.,]?[0-9]+/g);
            }
        } catch (err) {
            promo_price = 0
        }
    }
    return promo_price;
}

function processPrice(k) {
    if (document.getElementsByClassName("previewPrice").length) {
        for (var t = 0; t < document.getElementsByClassName("previewPrice").length; t++) {
            document.getElementsByClassName("previewPrice")[t].remove();
        }
    }
    if (null == k || 0 === parseFloat(k)) return 0;
    var c = 0;
    if (c = k.constructor === Array ? String(k[0]).replace(",", ".").match(/[0-9]*[\.]?[0-9]+/g) : String(k).replace(",", ".").match(/[0-9]*[.]?[0-9]+/g), isNaN(c) || 0 === parseFloat(k)) {
        return 0;
    }
    var n = "", e = 0;
    if (k.constructor === Array && 1 < k.length) {
        const i = currency_format(parseFloat(k[0]) * getExchangeRate()), v = k.length - 1,
            a = currency_format(parseFloat(k[v]) * getExchangeRate());
        n = 0 < parseFloat(k[v]) ? i + " - " + a : i
    } else {
        e = parseFloat(k);
        n = currency_format(e * getExchangeRate());
    }
    var h = document.getElementById("J_PromoPrice");
    if (h == null || h.length === 0) h = document.getElementById("J_StrPriceModBox");
    if (h == null || h.length === 0) h = document.getElementById("J_priceStd");
    if (h == null || h.length === 0) h = document.getElementById("J_StrPrice");

    var r = document.createElement("li");
    r.setAttribute("style", "color: blue ! important; padding: 30px 0px; font-family: arial;");
    r.setAttribute("class", "previewPrice");
    r.innerHTML =
        '<span class="tb-property-type" style="color: yellowgreen; font-weight: bold; font-size: 25px;"> Giá </span>    ' +
        ' <strong id="price_vnd" class="" style="font-size: 25px; color: blueviolet">' +
        '<em class=""> ' + n + ' </em>' +
        '<em class=""> VNĐ</em>' +
        '</strong>';
    if (h != null && h.length !== 0) {
        h.parentNode.insertBefore(r, h.nextSibling);
    }
}

function getExchangeRate() {
    // httpAsync("GET", "/api/get-exchange-rate", function (responseText) {
    //     console.log(responseText);
    // });
    // let xhr = new XMLHttpRequest();
    // xhr.open("GET", host + "/api/get-exchange-rate");
    // // xhr.onreadystatechange = function () {
    // //     if (xhr.readyState === 4) {
    // //         exchangeRate =  parseFloat(xhr.responseText);
    // //     }};
    // xhr.send();
    // xhr.onload = function () {
    //     if (xhr.readyState === 4) {
    //         exchangeRate = parseFloat(xhr.responseText);
    //     };
    // }
    return 3500
}

function currency_format(k, _) {
    if (!$.isNumeric(k)) return k;
    if (null == _ || 0 === _) {
        k = 10 * Math.ceil(k / 10)
    }
    return k = k.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
}

function getImageLink() {
    try {
        let src = "";
        try {
            let img_element = document.getElementById("J_ImgBooth");
            if (img_element == null) img_element = document.getElementById("J_ThumbView");
            if (img_element != null && img_element !== "") {
                src = img_element.getAttribute("src");
                encodeURIComponent(src);
                return src;
            }
            if ("IMG" === document.getElementById("J_ImgBooth").tagName) {
                var t = document.getElementById("J_UlThumb");
                try {
                    if (t != null) {
                        src = t.getElementsByTagName("img")[0].src;
                    } else {
                        src = document.getElementById("J_ImgBooth").src;
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                var c = document.getElementById("J_UlThumb");
                if (c != null) {
                    src = c.getElementsByTagName("li")[0].style.backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
                } else {
                    src = document.getElementById("J_ImgBooth").style.backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
                }
            }
        } catch (error) {
            console.log("Image not found!" + error)
        }

        src = resizeImage(src);
        encodeURIComponent(src);
        return src;
    } catch (error) {
        return ""
    }
}

function getItemID() {
    let item_id = 0;
    if (!item_id) {
        try {
            const tmp = document.getElementsByName("item_id");
            if (tmp != null && tmp.length !== 0) {
                item_id = tmp[0].value;
            } else {
                item_id = document.getElementsByName("item_id_num")[0].value;
            }
        } catch (error) {
        }
    }
    if (!item_id) {
        try {
            item_id = window.location.href.split(".htm")[0].split("item/")[1]
        } catch (error) {
        }
    }
    if (!item_id) {
        try {
            item_id = getParamsUrl("id", window.location.href)
        } catch (error) {
        }
    }
    return item_id
}

function getAmount() {
    try {
        var amount = document.getElementById("J_IptAmount");
        if (amount == null || amount.value === "") {
            amount = document.getElementsByClassName("mui-amount-input")[0];
        }
        return amount.value
    } catch (err) {
        throw Error(err.message + " Can't get origin price function getQuantity")
    }
}

function getDelivery() {
    var k = "";
    try {
        k = document.querySelectorAll("#J-From")[0].textContent
    } catch (k) {
    }
    return k;
}

function getStock() {
    try {
        var k = document.getElementById("J_EmStock"), _ = 99;
        null != k && "undefined" !== k || (k = document.getElementById("J_SpanStock")), null != k && "undefined" !== k && (_ = k.textContent, _ = parseInt(_.replace(/[^\d.]/g, "")))
    } catch (k) {
        _ = 99
    }
    return _
}

function getDataValue() {
    try {
        for (var k = "", _ = document.getElementsByClassName("tb-selected"), t = 0; t < _.length; t++) {
            var c = "";
            (c = -1 < _[t].className.indexOf("J_SKU") ? _[t].getAttribute("data-pv") : _[t].getAttribute("data-value")) && (k += c + ";")
        }
        return k
    } catch (k) {
        return ""
    }
}

function getSellerNick() {
    try {
        var _ = "", k = $(".tb-shop-ww .ww-light");
        if (null != k && "" !== k && 0 < k.length && (_ = k.attr("data-nick")), "" === _) {
            if (null == (k = document.querySelectorAll("span.seller")) || "" === k || "undefined" === k || 0 === k.length) {
                var t = document.getElementsByClassName("slogo-extraicon");
                null != t && "" !== t && "undefined" !== t && 0 < t.length && (k = t[0].getElementsByClassName("ww-light"))
            }
            if (null != k && "" !== k && 0 !== k.length || (k = document.querySelectorAll("div.hd-shop-desc span.ww-light")), 0 < k.length) {
                var c = k[0].getElementsByTagName("span");
                _ = null != c && "" !== c && 0 === c.length ? decodeURIComponent(c[0].getAttribute("data-nick")) : decodeURIComponent(k[0].getAttribute("data-nick"))
            }
            // if (_ == "" && $("#LineZing")[0]) {
            //     _ = "chaoshi Tmall"
            // }
        }
        else if (_ == null && $('.slogo-shopname')[0]) {
            _ = $('.logo-shopname').text()
        }
    } catch (k) {
        _ = "undefined shop name"
    }
    return _
}

function getProperties() {
    var k = "";
    try {
        var _ = document.getElementsByClassName("J_TSaleProp");
        if (_.length || (_ = document.querySelectorAll("ul.tb-cleafix")), 0 < _.length) for (var t = 0; t < _.length; t++) {
            var c = _[t].getElementsByClassName("tb-selected")[0];
            if (c) {
                var n = c.getElementsByTagName("span")[0].textContent;
                n && (k += n.trim() + ";")
            }
        }
    } catch (k) {
        console.warn("TAOBAO | getProperties: " + k.message)
    }
    return k
}

function isFull() {
    var k = document.getElementsByClassName("J_TSaleProp");
    "object" != typeof k && "" !== k && null != k || "object" == typeof k && 0 < k.length || (k = document.querySelectorAll("ul.tb-cleafix"));
    var _ = !0;
    if (0 < k.length) {
        for (var t = 0, c = 0; c < k.length; c++) {
            var n = k[c].getElementsByClassName("tb-selected");
            null != n && "undefined" !== n && (t += n.length)
        }
        t < k.length && (_ = !1)
    }
    return _
}

function getItemTittle() {
    try {
        var k = null;
        if (0 < document.getElementsByClassName("tb-main-title").length && (k = document.getElementsByClassName("tb-main-title")[0]), null == k && 0 < document.getElementsByClassName("tb-detail-hd").length) {
            var _ = document.getElementsByClassName("tb-detail-hd")[0];
            k = 0 < _.getElementsByTagName("h3").length && null != _ ? _.getElementsByTagName("h3")[0] : _.getElementsByTagName("h1")[0]
        }
        return "" === k.textContent && 0 < document.getElementsByClassName("tb-tit").length && (k = document.getElementsByClassName("tb-tit")[0]), "" === k.textContent && (null != (k = document.querySelectorAll("h3.tb-item-title")) ? k = k[0] : 0 < (k = document.getElementsByClassName("tb-item-title")).length && (k = k[0])), k.textContent;
    } catch (k) {
        return "";
    }
}

function getSellerID() {
    var k = "";
    if (document.querySelector('meta[name="microscope-data"]')) try {
        var _ = document.querySelector('meta[name="microscope-data"]').getAttribute("content");
        if (_) {
            var t = _.split(";");
            if (0 < t.length) for (var c = 0; c < t.length; c++) {
                var n = t[c], e = (n = n.trim()).split("="), i = e[0], v = e[1];
                if ("shopId" == i) {
                    k = v;
                    break
                }
            }
        }
    } catch (k) {
    } else if ($('#LineZing')) try {
        k = $('#LineZing').attr("shopid")
    } catch (k) {
    }
    else try {
        k = (document.querySelector(".shop-title-text")
            ? document.querySelector(".shop-title-text").getAttribute("href")
            : document.querySelectorAll(".tb-shop-name")[0].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].getAttribute("href")).replace("//shop", "").split(".")[0]
    } catch (k) {
    }
    return k
}

function alibaba_web_loaded() {
    const t = getTool();
    setInterval(function () {
        t.translateProperties();
        const price = t.getPromoPrice();
        if (price != null && price !== 0) {
            t.processPrice(price)
        } else {
            t.processPrice(t.getOriginPrice())
        }
    }, 1e3);
}

function getPriceTable() {
    try {
        let service_items = document.getElementsByClassName('tb-service-items-option');
        let tag = document.getElementsByClassName('tb-service-items-select-content');
        if (tag.length === 0) return "";
        let chosen_items = tag[0];
        var list = "";
        var clicked = false;
        var added = [];
        Loop: for (let i = 0; i < service_items.length; i++) {
            if (service_items[i].textContent === chosen_items.textContent) {
                clicked = true;
            }
            for (let j = 0; j < added.length; j++) {
                if (added[j] === service_items[i].textContent) {
                    continue Loop;
                }
            }
            added.push(service_items[i].textContent);

            if (i !== 0) {
                list += "next>"
            }
            list += service_items[i].textContent;
        }
        if (clicked === false) {
            list += "next>";
            list += chosen_items.textContent;
            list = "không bảo hành" + "list>" + list
        } else {
            list = chosen_items.textContent + "list>" + list;
        }
        if (list !== "") {
            list += "next>" + "không bảo hành";
        }
        return list;
    } catch (e) {

    }
    return "";
}
