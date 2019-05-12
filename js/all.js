$(function() {
    $( "a.uk-button[data-uk-toggle]" ).on( "click", function() {
        let classes = ($(this).attr('class') || '').split(' ');
        let title = $('#modal-callback').find('h4');
        let inputProduct = $( "form input[name=product]" );
        inputProduct.val(' ');
        title.next().remove();

        for (var i = 0, len = classes.length; i < len; i++) {
            switch(classes[i]) {
                case 'more':
                    title.text('Бесплатная консультация');
                    $( "<p class='text'>Оставьте заявку, мы свяжемся с Вами в ближайшее время и дадим подробную информацию по продукции.</p>" ).insertAfter(title);
                    break;
                case 'buy':
                    let count = $(this).data('count');
                    let price = $(this).data('price');
                    let wordShashki = count >4 ? ' шашек ' : ' шашки ';

                    title.text('Заказать');
                    $( "<p class='text'>" + count + wordShashki + 'по цене ' + price + 'руб' + "</p>" ).insertAfter(title);
                    inputProduct.val(count + wordShashki + 'по цене ' + price + 'руб');
                    break;
                default:
                    title.text('Заказать обратный звонок');
            }
        }
    });

    /* Метрика */
    (function(w,d,u){
        var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/60000|0);
        var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
    })(window,document,'https://cdn.bitrix24.ru/b8601243/crm/site_button/loader_6_sst09z.js');
});