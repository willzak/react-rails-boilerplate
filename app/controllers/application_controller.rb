class ApplicationController < ActionController::Base
  include ActionController::Helpers

  def fallback_index_html
    render :file => 'public/index.html'
  end

  def current_tile_for_player(board_id, player_id)
    board = Board.find(board_id)
    board_tiles = BoardTile.where(board: board)
    player = Player.find(player_id)
    current_tile = player.player_tiles.where(ended_at: nil, board_tile: board_tiles).first
    if !current_tile
      current_tile = player.player_tiles.where(board_tile: board_tiles).order("ended_at").last
    end
    
    return current_tile
  end

  def get_player_stats(board_id)
    board = Board.find(board_id)
    board_tiles = BoardTile.where(board: board)
    players = Player.where(game_id: board[:game_id]).order(:id)
    cards = players.map { |player| PlayerCard.where(player: player, board: board) }
    cards = cards.map { |player| player.empty? ? [] : player.map { |card| Card.where(id: card[:card_id], effect: 'Points').first ? Card.where(id: card[:card_id], effect: 'Points').first[:outcome] : 0 } }
    cards = cards.map { |player| player.inject(0){|sum,x| sum + x }}
    players = players.map.with_index { |player, index| {
      player: player,
      color: Color.find(player[:color_id]),
      user: User.find(player[:user_id]),
      books: PlayerTile.where.not(ended_at: nil).where(player: player, board_tile: board_tiles).length,
      points: (PlayerTile.where.not(ended_at: nil).where(player: player, board_tile: board_tiles).length * 3) + cards[index] + player[:score],
      last_play: current_tile_for_player(board_id, player[:id]) ? (current_tile_for_player(board_id, player[:id])[:ended_at] || current_tile_for_player(board_id, player[:id])[:created_at]) : player[:created_at]
    } }

    return players
  end

  def create_board_tiles(board)
    board_tiles = []
    tile_groups = TileGroup.all.pluck(:id)
    players = Game.find(board[:game_id]).players.all
    players.each { |player| player.update(position: 0, score: 0, moving: false, final_position: 0)}
    i = 0
    while i < 16 do
      if i == 0
        tile = Tile.where(tile_group_id: tile_groups[(i / 2).floor]).order(Arel.sql('random()')).first
      else
        tile = Tile.where.not(id: board_tiles[i - 1][:tile_id]).where(tile_group_id: tile_groups[(i / 2).floor]).order(Arel.sql('random()')).first
      end
      board_tiles.push(BoardTile.create(board: board, tile: tile))
      i += 1
    end

    board_tiles = board_tiles.map { |board_tile| {
      board_tile: board_tile,
      tile: Tile.find(board_tile[:tile_id]),
      color: Color.find(TileGroup.find(Tile.find(board_tile[:tile_id])[:tile_group_id])[:color_id]),
      books: board_tile.player_tiles.all.map { |player_tile| {
        player: { player: Player.find(player_tile[:player_id]), color: Color.find(Player.find(player_tile[:player_id])[:color_id]), user: User.find(Player.find(player_tile[:player_id])[:user_id]) }, 
        book: player_tile[:book_id] == nil ? [] : Book.find(player_tile[:book_id]),
        review: player_tile[:review_id] == nil ? [] : Review.find(player_tile[:review_id])
      } },
      recommendations: Tile.find(board_tile[:tile_id]).recommendations.all.map { |recommendation| { recommendation: recommendation, book: Book.find(recommendation[:book_id]) } }
    } }

    return board_tiles
  end

  def get_board_tiles(board)
    board_tiles = BoardTile.where(board: board)

    board_tiles = board_tiles.map { |board_tile| {
      board_tile: board_tile,
      tile: Tile.find(board_tile[:tile_id]),
      color: Color.find(TileGroup.find(Tile.find(board_tile[:tile_id])[:tile_group_id])[:color_id]),
      books: board_tile.player_tiles.all.map { |player_tile| {
        player: { player: Player.find(player_tile[:player_id]), color: Color.find(Player.find(player_tile[:player_id])[:color_id]), user: User.find(Player.find(player_tile[:player_id])[:user_id]) }, 
        book: player_tile[:book_id] == nil ? [] : Book.find(player_tile[:book_id]),
        review: player_tile[:review_id] == nil ? [] : Review.find(player_tile[:review_id])
      } },
      recommendations: Tile.find(board_tile[:tile_id]).recommendations.all.map { |recommendation| { recommendation: recommendation, book: Book.find(recommendation[:book_id]) } }
    } }

    return board_tiles
  end

  def http_token
      @http_token ||= if request.headers['Authorization'].present?
        request.headers['Authorization']
      end
  end

  def auth_token
    @auth_token ||= JsonWebToken.decode(@http_token)
  end

  def user_id_in_token?
    http_token && auth_token && @auth_token[:user_id].to_i
  end
end
