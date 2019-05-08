$(function() {
    $( "a.uk-button[data-uk-toggle]" ).on( "click", function() {
        let classes = ($(this).attr('class') || '').split(' ');
        let title = $('#modal-callback').find('h4');
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
                    break;
                default:
                    title.text('Заказать обратный звонок');
            }
        }
      });
});