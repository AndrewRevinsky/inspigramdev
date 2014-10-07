/**
 * Created by ANDREW on 10/7/2014.
 */
$(function(){

    // to avoid direct memory leak through closure
    var events = (function(){
        var _comm = $({}); // old versions of jQuery do not support {}.
        return function using(cb){
            try {
                cb(_comm);
            } catch (e){}
        };
    })();

    var auth = (function(){

        return function(){
            var winPromise = promiseFromSpawnedWindow(window.open('http://inspigramdev.azurewebsites.net/inspigramauth/start',
                'Instagram Authentication Process', 'menubar=no,location=yes,resizable=yes,scrollbars=no,status=no'));
            return winPromise;
        };

    })();

    function promiseFromSpawnedWindow(win){
        var interval;
        return $.Deferred(function(def){

            if (!win) return def.reject('blocked');

            var lastError, lastMessage;
            interval = window.setInterval(function(){
                try {
                    if (win.closed) {
                        debugger;
                        if (lastError) { return def.reject(lastError); }
                        if (lastMessage) { return def.resolve(lastMessage); }
                    }
                } catch (e) {}
                try {
                    if (win['response']) {
                        lastMessage = win['response'];
                        lastError = null;
                    }

                } catch (e){
                    lastError = e;
                }
            }, 100);
        }).always(function(){
            window.clearInterval(interval);
        }).promise();
    }

    $('body').on('click', '[data-action]', function(evt){
        var el = $(evt.currentTarget),
            action = el.data('action'),
            actionValue = el.data(action);

        var subEvent;
        events(function(comm){
            comm.trigger((subEvent = new $.Event(action + '.nspg', {
                'namespace' : 'nspg'
            })), {
                source: el,
                action: action,
                value: actionValue
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

    events(function(comm){
        comm.on('login.nspg', function(evt, args){

            auth().done(function(){
               alert('authed!');
            });

            return false;
        });
    });


});