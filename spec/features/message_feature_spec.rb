require 'rails_helper'

feature 'message', type: :feature do
  let(:user) { create(:user) }
  let(:group) { create(:group, name: "テスト用") }

  before do
    GroupUser.create(group_id: group.id, user_id: user.id)
  end

  scenario 'create messages' do
    # ログイン処理
    visit new_user_session_path
    fill_in 'user_email', with: user.email
    fill_in 'user_password', with: user.password
    find('input[name="commit"]').click
    expect(current_path).to eq root_path

    # グループ選択
    click_on('テスト用')
    expect(current_path). to eq group_messages_path(group)

    # ツイートの投稿
    ## 文章だけ
    expect {
      fill_in 'message[content]', with: "テストメッセージ"
      find('input[name="commit"]').click
    }.to change { Message.count }.by(1)

    ## イメージだけ
    expect {
      attach_file('message_image', 'public/images/no_image.jpg')
      find('input[name="commit"]').click
    }.to change { Message.count }.by(1)

    ## 文章とイメージ
    expect {
      fill_in 'message[content]', with: "テストメッセージ"
      attach_file('message_image', 'public/images/no_image.jpg')
      find('input[name="commit"]').click
    }.to change { Message.count }.by(1)
  end
end
