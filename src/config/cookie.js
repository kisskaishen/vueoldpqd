
module.exports = {
    //设置cookie
    set: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + encodeURI(cvalue) + "; " + expires+";path=/";
    },
    //获取cookie
    get: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return decodeURI(c.substring(name.length, c.length));
        }
        return "";
    },
    //清除cookie
    clear: function(name) {
        this.set(name, "", -1);
    }
};
