require 'rails_helper'

describe MessagesController, type: :request do
  # includeしてログイン
  include Devise::Test::IntegrationHelpers
  let(:group) { create(:group) }
  let(:user) { create(:user) }
  let!(:message){ create(:message, content: 'Hello', user: user, group: group) }

  describe '#index' do

    context 'login' do
      before do
        sign_in user
        get  group_messages_path(group)
      end

it 'returns 200' do
  expect(response.status).to be 200
end

it 'has proper response body' do
  expect(response.body).to include 'Hello'
end

it 'renders proper template' do
  expect(response).to render_template(:index)
end
    end

    context 'not login' do
      before do
        get  group_messages_path(group)
      end

      it 'returns 302' do
        # リダイレクトさせる時は大体このhttpステータス
        expect(response.status).to be 302
      end

      it 'redirects to new_user_session_path' do
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe '#create' do
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }
    let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }

    context 'login' do
      before do
        sign_in user
      end

      context 'can save' do
        subject { post group_messages_path(group, params) }

        it 'returns 302' do
          subject
          expect(response.status).to be 302
        end

        it 'redirects to group_messages_path' do
          subject
          expect(response).to redirect_to group_messages_path(group)
        end

        it 'creates message' do
          expect { subject }.to change(Message, :count).by(1)
        end
      end

      context 'can not save' do
        subject { post group_messages_path(group, invalid_params) }

        it 'returns 200' do
          subject
          expect(response.status).to be 200
        end

        it 'does not create message' do
          expect{ subject }.not_to change(Message, :count)
        end
      end
    end

    context 'not login' do
      before do
        post group_messages_path(group, params)
      end

      it 'returns 401' do
        expect(response.status).to be 401
      end

      it 'returns proper response body' do
        expect(response.body).to include "ログインしてください。"
      end
    end
  end
end
