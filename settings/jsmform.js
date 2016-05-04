/*!
 * JavaScript Cookie v2.0.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var _OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = _OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init (converter) {
        function api (key, value, attributes) {
            var result;

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                value = encodeURIComponent(String(value));
                value = value.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                    attributes.path    && '; path=' + attributes.path,
                    attributes.domain  && '; domain=' + attributes.domain,
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var name = parts[0].replace(rdecode, decodeURIComponent);
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    cookie = converter && converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.get = api.set = api;
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init();
}));

(function ($) {
    $.fn.values = function (data) {
        var els = $(this).find(':input').get();

        if (typeof data != 'object') {
            // return all data
            data = {};

            $.each(els, function () {
                if (this.name && !this.disabled && (this.checked
                    || /select|textarea/i.test(this.nodeName)
                    || /email|text|hidden|password/i.test(this.type))) {
                    data[this.name] = $(this).val();
                }
            });
            return data;
        } else {
            $.each(els, function () {
                if (this.name && data[this.name]) {
                    if (this.type == 'checkbox' || this.type == 'radio') {
                        $(this).attr("checked", (data[this.name] == $(this).val()));
                    } else {
                        $(this).val(data[this.name]);
                    }
                }
            });
            return $(this);
        }
    };

    $(document).ready(function () {
        $("span.jsmform").each(function () {
            $("<img/>").attr("src", jsmform.tempdir + "/assets/img/loader.gif").insertBefore($(this));
            var that = this;
            var b64data = $(this).html();
            $.post(jsmform.ajaxurl, {action: "jsmform", data: b64data}, function (data) {
                $(that).prev().remove();
                $(data).insertBefore($(that));
                $('.free-trial-inner #Country, .freeshirt-shipping-form #Country, .freeshirt-shipping-form #State').select2({
                    placeholder: 'Choose Country',
                    width: '100%',
                    minimumResultsForSearch: Infinity,
                    dropdownCssClass: 'free-trial-dropdown',
                    containerCssClass: 'free-trial-dropdown'
                });

                $('.page-template-thanks-page #Country').select2({
                    placeholder: 'Choose Country',
                    minimumResultsForSearch: Infinity
                });

                //$("input[name^='Phone']").numeric();

                //validate email
                /*$("input[name^='Email']").each(function () {
                    $(this).on("blur", function () {
                        var email = $(this).val();
                        if (!IsEmail(email)) {
                            $(this).parents("form").data("valid", false);
                        } else {
                            $(this).parents("form").data("valid", true);
                        }
                    });
                    $(this).parents("form").on("submit", function (e) {
                        if ($(this).data("valid") != true) {
                            e.preventDefault();
                            alert("Please correct the email address");
                            return false;
                        }
                    });

                });*/

            });
        });

        //jsmform new cookie based prefilling
        //Cookies.remove("jsmbucket");
        var infobucket = Cookies.get("jsmbucket");
        if(!infobucket) infobucket="{}";
        infobucket = JSON.parse(infobucket);
        $("form[action^='http://app-ab05.marketo.com/index.php/leadCapture/save'], form[action^='https://app-ab05.marketo.com/index.php/leadCapture/save']").each(function(){

            $(this).find("input:text, input:password,select, input[type='email']").val('');
            var formval = infobucket;
            delete(formval.returnURL);
            delete(formval.contentsubmissionURL);
            $(this).values(formval);

            $(this).on('submit',function(){
                var formval = $(this).values();
                delete(formval.formid);
                delete(formval.returnURL);
                delete(formval._mkt_trk);
                delete(formval.munchkinId);
                delete(formval.contentsubmissionURL);
                var newbucket = $.extend({},infobucket,formval);
                Cookies.set('jsmbucket',newbucket,{ expires: 60 });
            });
        });

        $('.free-trial-inner #Country, .regpg-main-form-element #Country').select2({
            placeholder: 'Choose Country',
            width: '100%',
            minimumResultsForSearch: Infinity,
            dropdownCssClass: 'free-trial-dropdown',
            containerCssClass: 'free-trial-dropdown'
        });

        $('.freeshirt-shipping-form #State').select2({
            placeholder: 'Choose State',
            width: '100%',
            minimumResultsForSearch: Infinity,
            dropdownCssClass: 'free-trial-dropdown',
            containerCssClass: 'free-trial-dropdown'
        });

        $('.freeshirt-shipping-form #ShirtSize').select2({
            placeholder: 'Choose Shirt Size',
            width: '100%',
            minimumResultsForSearch: Infinity,
            dropdownCssClass: 'free-trial-dropdown',
            containerCssClass: 'free-trial-dropdown'
        });


        $('.page-template-thanks-page #Country').select2({
            placeholder: 'Choose Country',
            minimumResultsForSearch: Infinity
        });

        $('.page-template-free-trial-page #Country').select2({
            placeholder: 'Choose Country',
            minimumResultsForSearch: Infinity,
            dropdownCssClass: 'free-trial-dropdown',
            containerCssClass: 'free-trial-dropdown'
        });

        //$("input[name^='Phone']").numeric();

        //validate email
        /*$("input[name^='Email']").each(function () {
            $(this).on("blur", function () {
                var email = $(this).val();
                if (!IsEmail(email)) {
                    $(this).parents("form").data("valid", false);
                } else {
                    $(this).parents("form").data("valid", true);
                }
            });
            $(this).parents("form").on("submit", function (e) {
                if ($(this).data("valid") != true) {
                    var email = $(this).find("input[name^='Email']").val();
                    if(!IsEmail(email)){
                        e.preventDefault();
                        alert("Please correct the email address");
                        return false;
                    }
                }
            });

        });*/
    });
})(jQuery);

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}