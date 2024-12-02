Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount ActionCable.server => '/cable'

  post '/login' => 'auth#login'
  get '/logged_in' => 'auth#logged_in'

  namespace :api do
    
    resources :users 
    resources :games do
      resources :players do
        resources :player_tiles
        resources :player_cards
      end
    end
    resources :boards do
      resources :board_tiles
      resources :results
    end
    resources :books
    resources :tile_groups
    resources :tiles
    resources :cards

    get '/users/:user_id/game_lists' => 'users#game_lists' # All playable, joinable and ended games for a user
    get '/games/:game_id/users' => 'games#users' # All users for a game
    get '/games/:game_id/players' => 'games#players' # All players for a game
    get '/games/:game_id/boards' => 'games#boards' # All boards for a game
    get '/boards/:board_id/users' => 'boards#users' # All users for a board
    get '/boards/:board_id/players' => 'boards#players' # All players for a board
    get '/boards/:board_id/winner' => 'boards#winner' # Winning player for a board

    post '/create_game' => 'games#create_game' # Create a game
    post '/join_game' => 'games#join_game' # Join a game
    post '/play_game' => 'games#play_game' # Play a game

    get '/books/:book_id/goodreads' => 'books#goodreads' # Goodreads call for specific book with ISBN
    get '/books/:book_id/google' => 'books#google' # Google call for specific book with ISBN
    post '/books/goodreads_search' => 'books#goodreads_search' # Goodreads call for search term provided
    post '/books/google_search' => 'books#google_search' # Google call for search term provided

    get '/colors' => 'games#colors' # All colors
    get '/games/:game_id/free_colors' => 'games#free_colors' # All free colors for a game
    get '/games/:game_id/current_board' => 'games#current_board' # Current board for a game

    get '/boards/:board_id/player_tiles' => 'boards#player_tiles' # All player tiles for all players for a board
    get '/boards/:board_id/player_chance' => 'boards#player_chance' # Current chance cards for all players for a board
    get '/boards/:board_id/player_stats' => 'boards#player_stats' # Books read and last play for all players for a board
    get '/boards/:board_id/players/:player_id/player_tiles' => 'players#player_tiles' # All player tiles for a player for a board
    get '/boards/:board_id/players/:player_id/player_chance' => 'players#player_chance' # Current chance cards for a player for a board
    get '/boards/:board_id/players/:player_id/draw_chance' => 'players#draw_chance' # Draws a chance card for a player for a board
    post '/boards/:board_id/players/:player_id/submit' => 'players#submit' # Submits a book (need board_tile_id, title and optional review)
    get '/boards/:board_id/players/:player_id/open_tile/:board_tile_id' => 'players#open_tile?' # Checks if the player has already started the tile but hasn't submitted the book (need board_tile_id)
    get '/boards/:board_id/players/:player_id/open_tile' => 'players#any_open_tile?' # Checks if the player has already started any tile but hasn't submitted the book (need board_tile_id)
    get '/boards/:board_id/players/:player_id/result' => 'players#result' # Returns the result for the given player and board

    get '/tile_groups/:tile_group_id/tiles' => 'tile_groups#tiles' # All games for a user

  end

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
