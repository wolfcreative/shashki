function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (typeof haystack[i] == 'object') {
            if (arrayCompare(haystack[i], needle)) return true;
        } else {
            if (haystack[i] == needle) return true;
        }
    }
    return false;
}
window.isset = function(v) {
    if (typeof(v) == 'object' && v == 'undefined') {
        return false;
    } else if (arguments.length === 0) {
        return false;
    } else {
        var buff = arguments[0];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof(buff) === 'undefined' || buff === null) return false;
            buff = buff[arguments[i + 1]];
        }
    }
    return true;
}

function myconf() {
    var cf = $.Deferred();
    $.ajax({
        type: 'POST',
        url: 'feedback/',
        dataType: 'json',
        data: 'act=cfg',
        success: function(answer) {
            cf.resolve(answer.configs);
        }
    });
    return cf;
}

var mcf = myconf();

mcf.done(function(conf) {

    $(document).ready(function() {
        (function() {
            var fb = $('.feedback');
            if (fb.length > 0) {
                fb.each(function() {
                    var form = $(this).closest('form'),
                        name = form.attr('name');
                    if (isset(conf[name]) && isset(conf[name].cfg.antispamjs)) {
                        $(form).prepend('<input type="text" name="' + conf[name].cfg.antispamjs + '" value="tesby" style="display:none;">');
                    }
                });
            }
        })();
    });


    /* Отправка форм */
    function feedback(vars) {
        var bt = $(vars.form).find('.feedback');
        var btc = bt.clone();
        var bvc = bt.val();
        var cfg = conf[vars.act].cfg;

        $.ajax({
            type: 'POST',
            url: 'feedback/',
            cache: false,
            dataType: 'json',
            data: 'act=' + vars.act + '&' + vars.data,
            beforeSend: function() {
                //$(bt).val('');
                $(bt).prop("disabled", true);
                $(bt).addClass('loading');
            },
            success: function(answer) {
                if (isset(cfg.notify) && !/none/i.test(cfg.notify)) {

                    if (/textbox/i.test(cfg.notify)) {
                        if (isset(answer.errors)) {
                            $.each(answer.errors, function(k, val) {
                                UIkit.notification("Ошибка! Проверьте форму", {
                                    pos: 'top-right',
                                    status: 'danger'
                                })
                            });
                        }
                        if (isset(answer.infos)) {
                            $.each(answer.infos, function(k, val) {
                                UIkit.notification("Внимание! " + val, {
                                    pos: 'top-right',
                                    status: 'warning'
                                })
                            });
                        }

                    }
                    if (/color/i.test(cfg.notify)) {
                        $(vars.form).find('input[type=text]:visible, textarea:visible, select:visible').css({
                            'border': '1px solid #D7D5CF'
                        }, 300);
                        if (isset(answer.errors)) {
                            $.each(answer.errors, function(k, val) {
                                var reg = /[a-z]/i;
                                if (reg.test(k)) {
                                    var e = $(vars.form).find('[name=' + k + ']');
                                    if (e.length == 1) {
                                        $(e).css({
                                            'border': '1px solid #c2363d'
                                        }, 100);
                                    }
                                }
                            });
                        }
                        if (isset(answer.infos)) {
                            var li = '',
                                $inf = $('<ul>', {
                                    id: 'feedback-infolist'
                                });
                            $.each(answer.infos, function(k, val) {
                                li += '<li>' + val + '</li>';
                            });

                            $inf.html(li);

                            UIkit.modal.dialog('<button class="uk-modal-close-default" type="button" uk-close></button><div class="uk-modal-header uk-text-center"><h2 class="uk-modal-title uk-margin-small-top">Готово!</h2></div><div class="uk-modal-body uk-text-center"><p>Форма успешно отправлена! Пожалуйста, ожидайте звонка менеджера. Вам скоро перезвонят</p></div>');

                            setTimeout(function() {
                                UIkit.modal('.uk-modal.uk-open').hide();
                            }, 7000);
                        }

                    }
                }
                $(bt).prop("disabled", false);
                $(bt).removeClass('loading');
                //$(bt).val(bvc);

                if (isset(answer.ok) && answer.ok == 1) {
                    $(vars.form)[0].reset();
                }
            }
        });

    }

    $(document).on('mouseenter mouseover', '.feedback', function() {
        var form = $(this).closest('form'),
            name = form.attr('name');
        if (isset(conf[name]) && isset(conf[name].cfg.antispamjs)) {
            $('input[name=' + conf[name].cfg.antispamjs + ']').val('');
        }
    });

    $(document).on('click', '.feedback', function() {
        var form = $(this).closest('form'),
            name = form.attr('name'),
            obj = {};
        obj.form = form;
        obj.act = name;
        obj.data = $(form).serialize();

        feedback(obj);

        return false;
    });
});