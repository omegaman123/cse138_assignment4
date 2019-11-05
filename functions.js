module.exports = {
    hash: function (str) {
        var hash = 0,
            i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            Math.imul(hash,31);

            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
    strSpl: function (str) {
        var res = str.toString().split(",");
        console.log("RES: " + res);
        return res;
    },
    sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

};

String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

Object.objsize = function(obj) {
    var size = 0, key;

    for (key in obj)
    {
        if (obj.hasOwnProperty(key))
            size++;
    }

    return size;

};