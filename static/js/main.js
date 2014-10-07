/**
 * Created by ANDREW on 10/7/2014.
 */
$(function () {

    var ctx = {
        tpl: {}
    };

    // to avoid direct memory leak through closure
    var events = (function () {
        var _comm = $({}); // old versions of jQuery do not support {}.
        return function using(cb) {
            try {
                cb(_comm);
            } catch (e) {
            }
        };
    })();

    var auth = (function () {

        return function () {
            var winPromise = promiseFromSpawnedWindow(window.open('http://inspigramdev.azurewebsites.net/inspigramauth/start',
                'Instagram Authentication Process', 'menubar=no,location=yes,resizable=yes,scrollbars=no,status=no,width=480,height=320'));
            return winPromise;
        };

    })();

    var api = (function(){
        var urlBase = _.template('https://api.instagram.com/v1/<%= endpoint %>?client_id=7c52051efa014bad915fe9bd29644358&callback=?');
        return {
            user_basic : getBasicUserInfo
        };

        function getBasicUserInfo(userId){
            var realUrl = urlBase({
                endpoint: 'users/' + userId
            });
            return $.getJSON(realUrl, {
                access_token: ctx.token
            });
        }
    })();

    function promiseFromSpawnedWindow(win) {
        var interval;
        return $.Deferred(function (def) {

            if (!win) return def.reject('blocked');

            var lastError, lastMessage;
            interval = window.setInterval(function () {
                try {
                    if (win.closed) {
                        if (lastError) {
                            return def.reject(lastError);
                        }
                        if (lastMessage) {
                            return def.resolve(lastMessage);
                        }
                    }
                } catch (e) {
                }
                try {
                    if (win['response']) {
                        lastMessage = (function () {
                            try {
                                return JSON.parse(win['response']);
                            } catch (e) {
                                return win['response'];
                            }
                        })();
                        lastError = null;
                    }
                } catch (e) {
                    lastError = e;
                }
            }, 100);
        }).always(function () {
            window.clearInterval(interval);
        }).promise();
    }

    $('body').on('click', '[data-action]', function (evt) {
        var el = $(evt.currentTarget),
            action = el.data('action'),
            actionValue = el.data(action);

        var subEvent;
        events(function (comm) {
            comm.trigger((subEvent = new $.Event(action + '.nspg', {
                'namespace': 'nspg'
            })), {
                source: el,
                action: action,
                value : actionValue
            });
        });

        if (subEvent.isDefaultPrevented()) {
            evt.preventDefault();
        }
        if (subEvent.isPropagationStopped()) {
            evt.stopPropagation();
        }
        if (subEvent.isImmediatePropagationStopped()) {
            evt.stopImmediatePropagation();
        }
    });

    events(function (comm) {
        comm.on('login.nspg', function (evt, args) {

            args.source.css({ 'border': '0 none'});

            auth().then(function (data) {

                comm.trigger('logged-in', {
                    access_token: data['access_token']
                });

                comm.trigger('user-short_data', {
                    user: data['user']
                });

            }, function(err){
                alert(err);
                args.source.css({ 'border': '1px red solid '});
            });

            return false;
        });

        comm.on('logged-in', function(evt, args){
            ctx.authPromise = $.Deferred().resolve(args['access_token']).promise();
            ctx.token = args['access_token'];
        });

        comm.on('user-short_data', function(evt, args){
            getTemplatePromiseOn(ctx.tpl, 'user', 'static/templates/user.tpl.html').done(function(tpl){
                var markup = tpl(args['user']);
                $(markup).appendTo('body');
            }).fail(function(){
                debugger;
            });

        });

        comm.on('api-call.nspg', function(evt, args){
            var vals = args['value'].split('|'),
                apiName = vals.shift();

            if (!api[apiName]) return;

            api[apiName].apply(api, vals).done(function(data){
                debugger;
            });

            return false;
        });
    });

    function getTemplatePromiseOn(obj, name, ref){
        var result = obj[name];
        if (!result || (result.state() == 'rejected')) {
            result = obj[name] = $.Deferred(function(def){
                $.get(ref).then(function(text){
                    try {
                        return _.template(text);
                    } catch(e) {
                        return function(arg){ return text; };
                    }
                }).then(def.resolve, def.reject);
            }).promise();
        }
        return result;
    }


});