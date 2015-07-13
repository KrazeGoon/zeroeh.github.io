"use strict";

function login_initialize(container, w, h) {
    var channel, socket, manual_close, cid;
    var connection_error_text = "connection error, please reload the page";
    var box;
    var canvas = $t.id('canvas');
    var label = $t.id('label');
    var set = $t.id('set');
    var selector_div = $t.id('selector_div');
    var info_div = $t.id('info_div');
    var turn_field = $t.id('turn_field');

    function mdice_initialize(container, w, h) {
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        on_set_change();

        function on_set_change(ev) { set.style.width = set.value.length + 3 + 'ex'; }
        $t.bind(set, 'keyup', on_set_change);
        $t.bind(set, 'mousedown', function(ev) { ev.stopPropagation(); });
        $t.bind(set, 'mouseup', function(ev) { ev.stopPropagation(); });
        $t.bind(set, 'focus', function(ev) { $t.set(container, { class: '' }); });
        $t.bind(set, 'blur', function(ev) { $t.set(container, { class: 'noselect' }); });

        $t.bind($t.id('clear'), ['mouseup', 'touchend', 'touchcancel'], function(ev) {
            ev.stopPropagation();
            set.value = '0';
            on_set_change();
        });

        box = new $t.dice.dice_box(canvas, { w: 500, h: 300 });
        box.use_adapvite_timestep = false;

        function show_selector() {
            info_div.style.display = 'none';
            turn_field.style.display = 'none';
            selector_div.style.display = 'inline-block';
            box.draw_selector();
        }

        function before_roll(vectors, notation) {
            selector_div.style.display = 'none';
            box.clear();
            hide_error();
            teal.id('waitform').style.display = "block";
            try {
                var response = $t.rpc({ method: 'roll', cid: cid,
                    vectors: vectors, notation: notation });
                if (response && response.error) show_error(response.error);
            }
            catch (e) {
                console.log(e);
                show_error(connection_error_text, true);
            }
        }

        function notation_getter() {
            return $t.dice.parse_notation(set.value);
        }

        box.bind_mouse(container, notation_getter, before_roll);
        box.bind_throw($t.id('throw'), notation_getter, before_roll);

        $t.bind(container, ['mouseup', 'touchend', 'touchcancel'], function(ev) {
            if (selector_div.style.display == 'none') {
                if (!box.rolling) show_selector();
                box.rolling = false;
                return;
            }
            var name = box.search_dice_by_mouse(ev);
            if (name) {
                var notation = $t.dice.parse_notation(set.value);
                notation.set.push(name);
                set.value = $t.dice.stringify_notation(notation);
                on_set_change();
            }
        });

        show_selector();
    }

    function show_error(text, terminal) {
        $t.id('error_text').innerHTML = text;
        if (terminal) {
            teal.id('waitform').style.display = "block";
            teal.id('waitform').style.cursor = "default";
        }
    }

    function hide_error() {
        $t.id('error_text').innerHTML = '&nbsp;';
    }

    var action_pool = {
        login: function(res) {
            var loginform = $t.id('loginform');
            if (loginform) {
                $t.remove(loginform);
                $t.element('div', { id: 'error_text', class: 'error-text' }, document.body);
                mdice_initialize(container, w, h);
                $t.id('info_field').style.display = "inline-block";
            }
            hide_error();
        },
        userlist: function(res) {
            var f = $t.id('info_field');
            f.innerHTML = 'players of room ' + res.room + ': ' + res.list.join(', ');
        },
        roll: function(res) {
            teal.id('waitform').style.display = "none";
            turn_field.innerHTML = "(last roll by " + res.user + ")";
            turn_field.style.display = 'inline-block';
            info_div.style.display = 'none';
            selector_div.style.display = 'none';
            box.clear();
            box.rolling = true;
            box.roll(res.vectors, function(result) {
                var r = result.join(' ');
                if (res.notation.constant) r += ' +' + res.notation.constant;
                if (result.length > 1) r += ' = ' + 
                        (result.reduce(function(s, a) { return s + a; }) + res.notation.constant);
                label.innerHTML = r;
                info_div.style.display = 'inline-block';
                box.rolling = false;
            });
        }
    };

    var socket_handler = {
        'onopen': function() {},
        'onmessage': function(m) {
            var res = JSON.parse(m.data);
            if (res.error) {
                show_error(res.error);
                socket.close();
                manual_close = true;
            }
            else if (action_pool.hasOwnProperty(res.action)) {
                action_pool[res.action](res);
            }
            teal.id('waitform').style.display = "none";
        },
        'onerror': function(m) {
            show_error(connection_error_text, true);
        },
        'onclose': function() {
            if (!manual_close) show_error(connection_error_text, true);
        }
    };

    function login(method) {
        hide_error();
        teal.id('waitform').style.display = "block";
        try {
            var response = $t.rpc({ method: method, user: $t.id('input_user').value,
                room: $t.id('input_room').value });
            if (response.error) {
                show_error(response.error);
                teal.id('waitform').style.display = "none";
            }
            else {
                cid = response.cid;
                channel = new goog.appengine.Channel(response.tid);
                manual_close = false;
                socket = channel.open(socket_handler);
            }
        }
        catch (e) {
            show_error(connection_error_text, true);
            console.log(e);
        }
    }

    teal.id('waitform').style.display = "none";
    $t.remove($t.id('loading_text'));
    $t.bind($t.id('button_join'), "click", function() {
        login("join");
    });
}

