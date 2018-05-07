$(document).on("turbolinks:load", function() {

    $(function(){
    setInterval(update, 5000);
  });

  function flash() {
    var html =`<p class="notice">メッセージを送信しました</p>`
    $('.notification').append(html);
    $('.notice').fadeIn(500).fadeOut(2000);
    setTimeout(function(){
     $('.notice').remove();
    },2500);
  }

  function buildHTML(message){
    var insertImage = '';
    if (message.image) {
      insertImage = `<img src="${message.image}">`;
    }
    var html = `<div class="chat-main__body--id" data-message-id="${message.id}">
                <div class="chat-main__body--name">
                  ${message.user_name}
                </div>
                <div class="chat-main__body--date">
                  ${message.created_at}
                </div>
                <div class="chat-main__body--message">
                <p class="lower-message__content">
                  ${message.content}
                </p>
                <img class='lower-message__image'>
                  ${insertImage}
                </img>
                </div>
                </div>`
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__body').append(html)
      $('#textbox').val('')
      flash();
      var position = $('#chat-main__body').offset().top;
      $('.chat-main__body').animate({scrollTop: position + "99px"}, 500);
    })
    .fail(function(data){
      alert('メッセージを入力してください');
    });
    return false;
  });


  function update(){
     if($('.chat-main__body--id')[0]){
      var message_id = $('.chat-main__body--id:last').data('messageId');
    } else {
      var message_id = 0
    }

    var message_id = $('.chat-main__body--id:last').data('messageId');
   $.ajax({
      url: location.href,
      type: 'GET',
      data: {
        message: { id: message_id }
      },
      dataType: 'json'
    })
    .done(function(data){
      $.each(data, function(i, data){
        var html = buildHTML(data);
        $('.chat-main__body').append(html)
        var position = $('#chat-main__body').offset().top;
        $('.chat-main__body').animate({scrollTop: position + "99px"}, 500);
      });
    });
  }
});
