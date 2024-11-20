from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from driver import nwsl_driver
import logging
import os


app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the NWSLink API!"})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'success', 'message': 'Connection successful'}), 200

@app.route('/random_player', methods=['GET'])
def get_random_player():
    app.logger.info('Random player endpoint accessed')
    player = nwsl_driver.get_random_player()
    if player:
        return jsonify({"player": player["name"]})
    else:
        return jsonify({"error": "Could not get random player"}), 404

@app.route('/random_played_for', methods=['GET'])
def get_random_played_for():
    player = request.args.get('player')
    team = request.args.get('team')
    
    if not player:
        return jsonify({"error": "Player parameter is required"}), 400
    
    random_team = nwsl_driver.get_random_played_for(player, team=team)
    
    if random_team:
        return jsonify({"team": random_team["t"]["team"], "seasons": random_team["f"]["seasons"]})
    else:
        return jsonify({"error": "Could not get random team node"}), 404

@app.route('/random_teammate', methods=['GET'])
def get_random_teammate():
    team = request.args.get('team')
    season = request.args.get('season')
    
    if not team or not season:
        return jsonify({"error": "Team and season parameters are required"}), 400
    
    teammate = nwsl_driver.get_random_teammate(team, season)
    if teammate:
        return jsonify({"teammate": teammate["name"]})
    else:
        return jsonify({"error": "Could not get random teammate"}), 404

@app.route('/is_valid_player', methods=['GET'])
def is_valid_player():
    name = request.args.get('name')
    is_valid_player = nwsl_driver.is_valid_player(name)
    return jsonify({"is_valid_player": bool(is_valid_player)})

@app.route('/is_valid_team_name', methods=['GET'])
def is_valid_team_name():
    team = request.args.get('team')
    is_valid_team_name = nwsl_driver.is_valid_team_name(team)
    return jsonify({"is_valid_team_name": bool(is_valid_team_name)})

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
