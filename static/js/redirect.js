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

    var payload = {
        "client_id": "7c52051efa014bad915fe9bd29644358",
        "client_secret": "d6972c67c4be458eb407f3f7d42017c5",
        "grant_type": "authorization_code",
        //"WEBSITE URL": "http://andrewrevinsky.github.io/inspigramdev/",
        "redirect_uri":"http://andrewrevinsky.github.io/inspigramdev/redirect.html",
        "code" : search.code
    };

    //var auth = $.post('https://api.instagram.com/oauth/access_token', );
    var markup = '';
    $.each(payload, function(k,v){
       markup += '<input type="hidden" name="'+k+'" value="'+v+'" />';
    });
    markup += '<input type="submit" value="Submit" />';
    $('form').html(markup);



});