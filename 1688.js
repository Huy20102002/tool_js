const _1688 = function () {
    this.getOriginPrice = function () {
        return getOriginPrice();
    };
    this.getPromoPrice = function () {
        return getPromoPrice();
    };
    this.processPrice = function (k) {
        processPrice(k);
    };
    this.getExchangeRate = function () {
        return getExchangeRate();
    };
    this.currency_format = function (k, _) {
        return currency_format(k, _);
    };
    this.translateProperties = function () {
        $(".tb-property-type").each(function () {
            var t = $(this).text();
            $(this).text(key_translate_lib(t))
        });
    };
    this.translatePrices = function () {
        let text_warn = "";
        try {
            for (var scripts = document.querySelectorAll("script"), i = 0; i < scripts.length; i++) {
                var html = scripts[i].textContent, res = html.search("iDetailConfig");
                console.log(res);
                if (-1 !== res) {
                    eval(html);
                    var d = {
                        iDetailConfig: iDetailConfig,
                        iDetailData: iDetailData
                    };
                    priceRange = (null == iDetailData.sku.priceRange) ? iDetailData.sku.priceRangeOriginal : iDetailData.sku.priceRange;
                    for (ii = 0; ii < priceRange.length; ii++) {
                        var qRange = priceRange[ii][0], pRange = priceRange[ii][1],
                            priceVND = parseFloat(pRange) * parseFloat(getExchangeRate());
                        priceVND = currency_format(priceVND.toFixed(2));
                        var text_first = 0 === ii ? "Mua" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                        ii < priceRange.length - 1 ?
                            text_warn += text_first +
                                " từ <strong>" + qRange + "-" + (priceRange[ii + 1][0] - 1) +
                                "</strong> sản phẩm giá là: <strong>" + pRange + "¥ (" + priceVND + "đ)</strong><br />" :
                            text_warn += text_first + " từ <strong>" + qRange +
                                "</strong> sản phẩm trở lên giá là: <strong>" + pRange + "¥ (" + priceVND + "đ)</strong><br />"
                    }
                    break
                }
            }
        } catch (ignored) {
        }
        var step = getStep();
        if (step) {
            for (var textStep = "", maxStep = 5, o = 1; o <= maxStep; o++) 1 !== o && (textStep += parseInt(step) * o + ", ", o == maxStep && (textStep += "..."));
            text_warn += "Số lượng mua phải là bội số của <strong>" + step + "( VD: " + textStep + " )</strong>"
        }
        var require_min = getRequireMin();
        text_warn += ", mua ít nhất <strong>" + require_min + "</strong> sản phẩm";
        var stock = getStock1688();
        if (text_warn += "<br />Hiện còn <strong>" + stock + "</strong> sản phẩm trong kho</br />", text_warn) {
            text_warn = "<h5 style='font-size: 18px;border-bottom: 1px solid #ccc;'>Chính sách bán của người bán</h5>" + text_warn;
            var obj_leading = $(".obj-leading");
            null != obj_leading && 0 < obj_leading.length ? obj_leading.before(text_warn) : $(".obj-sku").before(text_warn)
        }
    }
};

const _1688_getter = function () {
    this.getAmount = function () {
        return getAmount();
    };

    this.getDelivery = function () {
        return getDelivery();
    };
    this.getProperties = function () {
        const properties = [];
        try {
            const a = document.querySelectorAll(".table-sku .amount-input");
            for (let i = 0; i < a.length; i++) {
                const master_node = a[i].parentNode.parentNode.parentNode.parentNode;
                const master_info = JSON.parse(master_node.getAttribute("data-sku-config"));

                var information = {
                    "image_src": "",
                    "name": "",
                    "amount": 0,
                    "max": 0,
                    "price": ""
                };

                information.name = master_info.skuName;
                information.max = master_info.max;
                try {
                    var name_tag = master_node.querySelectorAll(".name")[0];
                    var image_tag = name_tag.querySelectorAll(".image")[0];
                    var data_img = image_tag.getAttribute("data-imgs");
                    information.image_src = JSON.parse(data_img).original;
                } catch (ignored) {
                }

                try {
                    var price_tag = master_node.querySelectorAll(".price")[0];
                    var value_tag = price_tag.querySelectorAll(".value")[0];
                    information.price = value_tag.textContent;
                } catch (e) {
                    console.log(e)
                }

                try {
                    var amount_tag = master_node.querySelectorAll(".amount")[0]
                        .querySelectorAll(".control")[0]
                        .querySelectorAll(".unit-detail-amount-control")[0]
                        .querySelectorAll(".amount-input")[0];
                } catch (e) {
                    console.log(e)
                }

                // console.log(information);
                // var o = a[r].value;
                // var h = a[r].parentNode.parentNode.parentNode.parentNode;
                // var u = JSON.parse(h.getAttribute("data-sku-config")).skuName;
                // console.log(u + ', ' + h.innerHTML + ", " + o);
                properties.push(information);
            }

            // if(getStep() === 1) {
            const temp = document.getElementsByClassName("table-sku")[0];
            console.log(temp);
            console.log(properties.length);
            if (typeof temp !== 'undefined') {
                console.log(temp.rows.length);
                for (let i = 0; i < temp.rows.length; i++) {
                    var config = JSON.parse(temp.rows[i].getAttribute("data-sku-config"));
                    for (var j = 0; j < properties.length; j++) {
                        if (config["skuName"] === properties[j].name && config.max === properties[j].max) {
                            properties[j].amount = temp.rows[i].querySelector('.amount-input').value;
                            break;
                        }
                    }
                }
            } else if(properties.length === 0) {
                console.log(document.getElementsByClassName('amount-input')[0]);
                properties.push({
                    "image_src": "",
                    "name": "",
                    "amount": document.getElementsByClassName('amount-input')[0].value,
                    "max": 0,
                    "price": ""
                });
                console.log(properties)

            }
            // }
        } catch (error) {
            console.error(error.message)
        }
        const tmp = [];
        for (let i = 0; i < properties.length; i++) {
            if (properties[i].amount > 0) {
                if(properties[i].price === "") {
                    try {
                        properties[i].price = document.getElementsByClassName('price-now')[0].textContent;
                    } catch (e) {
                    }
                }
                tmp.push(properties[i]);
            }
        }
        return tmp;
    };

    this.isFull = function () {
        return isFull();
    };

    this.getShopName = function () {
        var k = "";
        try {
            var _ = document.getElementsByName("sellerId");
            _.length && (k = _[0].value), k || (_ = document.getElementsByClassName("contact-div")).length && (k = _[0].getElementsByTagName("a")[0].innerHTML), k || (k = (_ = (_ = (_ = (_ = document.querySelectorAll("meta[property='og:product:nick']")[0].getAttribute("content")).split(";"))[0]).split("="))[1])
        } catch (k) {
        }
        return k
    };
    this.getShopId = function () {
        try {
            var k = document.querySelectorAll(".apply-btn")[0].getAttribute("data-unit-config");
            return JSON.parse(k).sellerId
        } catch (k) {
        }
        try {
            return getParamsOnPage().iDetailConfig.userId
        } catch (k) {
        }
        return ""
    };

    this.getSellerNick = function () {
        try {
            return $("div.contactSeller")[0].childNodes[3].textContent
        } catch (error) {
            console.log(error);
            return ""
        }
    };
    this.getSellerID = function () {
        var k = "";
        try {
            var _ = document.querySelectorAll(".apply-account")[0].getElementsByTagName("a")[0].getAttribute("data-unit-config");
            k = (_ = JSON.parse(_)).sellerId
        } catch (k) {
        }
        return k
    };
    this.getItemID = function () {
        var _ = 0;
        try {
            try {
                _ = iDetailConfig.offerid
            } catch (k) {
                _ = window.location.href.split(".html")[0].split("offer/")[1]
            }
        } catch (k) {
        }
        return _
    };
    this.getItemTitle = function () {
        var k = "";
        try {
            var _ = document.getElementsByName("offerTitle");
            _.length && (k = _[0].value), k || (_ = document.getElementById("mod-detail-hd")) && (k = _.getElementsByTagName("h1")[0].innerHTML)
        } catch (k) {
        }
        if (k === "") {
            try {
                var title = document.getElementById("mod-detail-title");
                return title.getElementsByClassName('d-title')[0].textContent;
            } catch (e) {
            }
        }
        return k
    };
    this.getItemImage = function () {
        var k = "";
        try {
            const _ = document.querySelectorAll(".list-leading a.image.selected img"),
                t = document.querySelectorAll("li.tab-trigger.active img");
            _.length ? k = _[0].getAttribute("src") : t.length && (k = t[0].getAttribute("src"));
        } catch (error) {
            console.log(error);
        }
        try {
            if (!k) {
                const c = document.querySelectorAll(".list-leading a.image img"),
                    n = document.querySelectorAll("li.tab-trigger img");
                c.length ? k = c[0].getAttribute("src") : n.length && (k = n[0].getAttribute("src"))
            }
        } catch (error) {
            console.log(error);
        }
        return resizeImage(k);
    };
    this.getItemLink = function () {
        var url = window.location.href;
        url = removeURLParameter(url, 'properties');
        url = removeURLParameter(url, 'propertiesId');
        url = removeURLParameter(url, 'quantity_bought');
        return url
    };
    this.getWeight = function () {
        var _ = 0;
        try {
            var k = document.getElementsByClassName("unit-detail-freight-cost");
            if (0 < k.length) {
                var t = JSON.parse(k[0].getAttribute("data-unit-config"));
                _ = isNaN(t.unitWeight) ? 0 : t.unitWeight
            }
        } catch (k) {
            _ = 0
        }
        return parseFloat(_)
    };
    this.getPriceTable = function () {
        var k = [], _ = null, t = [], c = null, n = null, i = 0;
        try {
            if (null != (c = document.getElementById("mod-detail-price"))) {
                var v = c.getElementsByClassName("unit-detail-price-amount");
                if (null != v && 0 < v.length) {
                    if (0 < (n = v[0].getElementsByTagName("tr")).length) for (i = 0; i < n.length; i++) t = n[i], _ = JSON.parse(t.getAttribute("data-range")), k.push(_)
                } else if (null != (n = c.querySelectorAll("tr.price td")) && 0 < n.length) for (var a = 0; a < n.length; a++) try {
                    var r = (t = n[a]).getAttribute("data-range");
                    "" !== r && (_ = JSON.parse(r), k.push(_))
                } catch (k) {
                }
            } else {
                var o = {}, h = document.getElementsByClassName("offerdetail_common_beginAmount");
                if (0 < h.length) {
                    o.begin = h[0].getElementsByTagName("p")[0].textContent, o.begin = o.begin.match(/[0-9]+/)[0], c = document.getElementsByClassName("unit-detail-price-display")[0].textContent.split("-");
                    var u = {};
                    for (i = 0; i < c.length; i++) u[i] = c[i].match(/[0-9]*[.]?[0-9]+/g).join("");
                    o.price = u, o.end = ""
                }
                k.push(o)
            }
        } catch (e) {
            throw Error(e + "Error function getPriceTable()")
        }
        return JSON.stringify(k)
    };
    this.getPriceByPriceTable = function (table, amount) {
        let price = 0;
        try {
            if ("object" == typeof (table = JSON.parse(table))) {
                for (var c in table) {
                    if (table.hasOwnProperty(c) && null != table[c]) {
                        const n = table[c].begin, e = table[c].end;
                        if (n <= amount && amount <= e || n <= amount && (0 === parseInt(e) || null == e || "" === e) || amount <= n) {
                            price = table[c].price;
                            break
                        }
                        price = table[c].price
                    }
                }
            }
        } catch (error) {
            price = 0
        }
        return price
    };

    this.getPropertiesId = function () {
        try {
            let list = document.getElementsByClassName("list-leading");
            if(list.length <= 0) return "";
            for(let i = 0; i < list.length; i++) {
                let selected = list[i].getElementsByClassName("selected");
                if(selected.length > 0) {
                    return selected[0].parentElement.getAttribute('data-unit-config')
                }
            }
            return "undefined";
        } catch (e) {
            return ""
        }
    };

    this.getData = function () {
        return {
            "source": "1688",
            "item_title": this.getItemTitle(),
            "item_link": this.getItemLink(),
            "item_id": this.getItemID(),
            "image_link": this.getItemImage(),
            "seller_nick": this.getSellerNick(),
            "seller_id": this.getSellerID(),
            "stock": getStock1688(),
            "step": getStep(),
            "prices_config": this.getPriceTable(),
            "properties": this.getProperties(),
            "properties_id": this.getPropertiesId(),
            "min_requirement": getRequireMin()
        }
    }
};

function detail_1688_loaded() {
    const t = getTool();
    t.translatePrices();
    setInterval(function () {
    }, 1e3);
}

function checkHasOneProperty() {
    var k = getParamsOnPage(), _ = 0;
    try {
        _ = k.iDetailData.sku.skuProps.length
    } catch (k) {
    }
    return !_
}


function getParamsOnPage() {
    try {
        for (var scripts = document.querySelectorAll("script"), i = 0; i < scripts.length; i++) {
            var html = scripts[i].textContent, res = html.search("iDetailConfig");
            if (-1 !== res) {
                eval(html);
                return {iDetailConfig: iDetailConfig, iDetailData: iDetailData};
                break
            }
        }
    } catch (k) {
        console.info("Can not get params on page");
        console.warn(k.message)
    }
    return null
}

function getStep() {
    try {
        var k, _, t, c;
        k = 1;
        _ = document.getElementsByClassName("mod-detail-purchasing-multiple");
        t = document.getElementsByClassName("mod-detail-purchasing-single");
        c = document.getElementsByClassName("mod-detail-purchasing-quotation");
        return "" !== (k = 0 < _.length && null != _ ? JSON.parse(_[0].getAttribute("data-mod-config")).wsRuleNum : 0 < t.length && null != t ? JSON.parse(t[0].getAttribute("data-mod-config")).wsRuleNum : 0 < c.length && null != c ? 0 : 1) && null != k || (k = 1), k
    } catch (k) {
        throw Error(k + "Error function getStep()")
    }
}

function getRequireMin() {
    let minNumber = 1;
    try {
        var t = $(".unit-detail-freight-cost");
        if (null != t) {
            let c = t.attr("data-unit-config");
            c = $.parseJSON(c);
            minNumber = c.beginAmount
        }
    } catch (error) {
        minNumber = 1
    }
    return minNumber
}

function getStock1688() {
    var k = 0;
    if (checkHasOneProperty()) try {
        var _ = document.querySelectorAll(".mod-detail-purchasing")[0].getAttribute("data-mod-config");
        k = JSON.parse(_).max
    } catch (k) {
    } else try {
        var params = getParamsOnPage();
        k = params.iDetailData.sku.canBookCount
    } catch (error) {
        console.log(error);
    }
    return k
}
