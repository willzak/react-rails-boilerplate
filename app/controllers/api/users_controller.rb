class Api::UsersController < ApplicationController
  def index
    @users = User.all

    render :json => @users
  end

  def show
    @user = User.find(params[:id])

    render :json => @user
  end

  def create
    @user = User.new(user_params)

    if @user.save
      render :json => @user
    else
      render :json => {
        error: 'User was not saved'
      }
    end
  end

  def update
    @user = User.find(params[:id])

    if @user.update(user_params)
      render :json => @user
    else
      render :json => {
        error: 'User was not updated'
      }
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy

    render :json => {
      message: 'User was destroyed'
    }
  end

  def games
    @games = User.find(params[:user_id]).players.all.map { |player| Game.find(player[:game_id]) }

    render :json => @games
  end

  def joinable_games
    @joined_games = Player.where(user_id: params[:user_id]).pluck(:game_id)
    @games = Game.where.not(id: @joined_games)

    render :json => @games
  end

  private
    def user_params
      params.permit(:name, :email, :password_digest)
    end
end
