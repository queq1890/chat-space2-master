$(document).on("turbolinks:load", function() {

  var search_list = $("#user-search-result");

  function appendUser(user) {
   var html = `<div class="chat-group-user clearfix">
              <p class="chat-group-user__name">${ user.name }</p>
              <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${ user.id } data-user-name=${ user.name }>追加</a>
              </div>`
    search_list.append(html);
  }

  function appendNoUser(user) {
    var html = `<div class="chat-group-user clearfix">
                <p class="chat-group-user__name">${ user.name }</p>
                <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${ user.id } data-user-name=${ user.name }>追加</a>
                </div>`
    search_list.append(html);
  }

  function buildMemberHTML(id, name) {
    var html =
    `<div class="chat-group-user clearfix" id=chat-group-user-${id}>
      <input type="hidden" name="group[user_ids][]" value="${id}">
      <p class="chat-group-user__name">${name}</p>
      <a class="user-search-remove chat-group-user__btn chat-group-user__btn--remove" data-user-id="${id}">削除</a>
    </div>`;
    return html
  }

  $("#user-search-field").on("keyup", function() {
    var input = $("#user-search-field").val();

    $.ajax({
      type: 'GET',
      url: '/users',
      data: { keyword: input },
      dataType: 'json'
    })

    .done(function(users) {
     $("#user-search-result").empty();
     if (users.length !== 0) {
       users.forEach(function(user){
         appendUser(user);
       });
     }
   })
    .fail(function() {
      alert('ユーザー検索に失敗しました');
    })
  });

  // メンバーの追加
  $('#user-search-result').on('click', '.chat-group-user__btn--add', function(e) {
    e.preventDefault();
    var id = $(this).data('userId');
    var name = $(this).data('userName');
    var insertHTML = buildMemberHTML(id, name);
    $('#chat-group-users').append(insertHTML);
    $(this).parent('.chat-group-user').remove();
  });

    $('#chat-group-users').on('click', '.user-search-remove', function() {
    var id = $(this).data('userId');
    $(`#chat-group-user-${id}`).remove();
  });
});

