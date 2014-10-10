/**
 * Created by ANDREW on 10/7/2014.
 */
$(function(){
    var search = (function(input){
        var result = {}, pairs = input.split(/\??(.[^&]*\&?)*/);
        for(var item; item = pairs.shift(), typeof item != 'undefined'; ) {
            if (!item) continue;
            if (/=/.test(item)) {
                var nv = item.split('=');
                result[nv[0]] = nv[1];
            }
        }
        return result;
    })(window.location.search);

    //https://api.instagram.com/oauth/authorize/?client_id=7c52051efa014bad915fe9bd29644358&redirect_uri=http://andrewrevinsky.github.io/inspigramdev/redirect.html&response_type=code

    if (!search.code) { return self.close(); }

    $.getJSON('http://inspigramdev.azurewebsites.net/inspigramauth/end?callback=?&isdev=true', {
        code: search.code
    }).then(function(data, resp){
        // $('<div></div>').appendTo('body').text(data)
        window['response'] = data;
        window.setTimeout(function(){
            delete window['response'];
            window.close();
        }, 150);
    });

});