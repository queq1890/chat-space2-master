if @new_message.present?
json.array! @new_message.each do |message|
  json.user_name     message.user.name
  json.created_at     message.created_at.strftime("%Y年%m月%d日 %H時%M分")
  json.content     message.content
  json.image    message.image.url
  json.id       message.id
end
end
