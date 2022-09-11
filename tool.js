const dictionary = [];
dictionary["颜色"] = "Màu";
dictionary["尺码"] = "Kích cỡ";
dictionary["尺寸"] = "Kích cỡ";
dictionary["价格"] = "Giá";
dictionary["促销"] = "Khuyến mại";
dictionary["配送"] = "Giao hàng tới";
dictionary["数量"] = "Số Lượng";
dictionary["销量"] = "Chính sách";
dictionary["评价"] = "Đánh Giá";
dictionary["颜色分类"] = "Màu sắc";
dictionary["促销价"] = "Giá";
dictionary["套餐类型"] = "Loại";
dictionary["单价（元）"] = "Giá (NDT)";
dictionary["库存量"] = "Tồn kho";
dictionary["采购量"] = "SL mua";
dictionary["材质保障"] = "Chất lượng";
dictionary["15天包换"] = "15 đổi trả";
dictionary["48小时发货"] = "48 giờ giao hàng";
dictionary["参考身高"] = "Chiểu cao tương ứng";
dictionary["优惠"] = "Ưu đãi";
dictionary["淘宝价"] = "Giá khuyến mãi";
dictionary["起批量"] = "Tỉ lệ đặt";
dictionary["物流"] = "Giao hàng tới";
dictionary["成交\\评价"] = "Số lượng đã mua/ đánh giá";
dictionary["包装规格"] = "Thông số đóng gói";
dictionary["联系卖家"] = "Người bán";
dictionary["交易勋章"] = "Huy chương";
dictionary["供应等级"] = "Khả năng cung ứng";
dictionary["经营模式"] = "Mô hình kinh doanh";
dictionary["招商代理"] = "Đại lý đầu tư";
dictionary["所在地区"] = "Khu vực";
dictionary["货描"] = "Đánh gia của người mua";
dictionary["发货"] = "Lô hàng";
dictionary["回头率"] = "Doanh thu";
dictionary["1688首页"] = "Trang chủ 1688";
dictionary["我的阿里"] = "Dịch vụ";
dictionary["进货单"] = "Đơn đặt hàng";
dictionary["信誉"] = "Uy tín";
dictionary["联系"] = "Liên hệ";
dictionary["资质"] = "Chuyên môn";

const tb = new taobao();
const  tb_getter = new taobao_getter();
const tm = new tmall();
const tm_getter = new tmall_getter();
// const _1688_ = new _1688();
// const _1688_getter_ = new _1688_getter();

function key_translate_lib(text) {
    if(dictionary[text] != null) return dictionary[text];
    return text;
}

function match(web) {
    const url = window.location.href;
    switch (web) {
        case "taobao":
            return url.match(/item.taobao/);
        case "tmall":
            return url.match(/detail.tmall/);
        // case "1688":
        //     return url.match(/detail.1688/);
    }
    return false;
}

function getToolGetter() {
    const url = window.location.href;
    if(url.match(/item.taobao/)) {
        return tb_getter;
    }

    if( url.match(/detail.tmall/)) {
        return tm_getter;
    }

    // if(url.match(/detail.1688/)) {
    //     return _1688_getter_;
    // }
    return null;
}

function getTool() {
    const url = window.location.href;
    if(url.match(/item.taobao/)) {
        return tb;
    }

    if( url.match(/detail.tmall/)) {
        return tm;
    }

    // if(url.match(/detail.1688/)) {
    //     return _1688_;
    // }
    return null;
}

function getParamsUrl(k, _) {
    var t = "";
    if ("" === (t = _ || window.location.href)) return null;
    var c = new RegExp("[\\?&]" + k + "=([^&#]*)").exec(t);
    return null === c ? null : c[1] || 0
}

function resizeImage(k) {
    return k.replace(/[0-9]{2,3}[x][0-9]{2,3}/g, "150x150")
}

function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}
