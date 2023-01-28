import json
import flask
import flask_socketio
import utils

# initialize the app
app = flask.Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = flask_socketio.SocketIO(app)

players = []
deck = utils.create_deck()

# routes
@app.route('/')
def index():
    return flask.render_template('index.html')

@socketio.on('connect')
def connect():
    print('connected')
    socketio.emit('init', players)

@socketio.on('enter')
def enter(player):
    if player:
        print(player + ' entered the room')
        players.append(player)
        socketio.emit('update', players, broadcast=True)

@socketio.on('reload')
def reload():
    socketio.emit('update', players, broadcast=True)

@socketio.on('leave')
def leave(player):
    if player:
        print(player + ' left the room')
        players.remove(player)
        socketio.emit('update', players)

@socketio.on('start')
def start(started):
    if started == 0:
        print(f'game is starting with {len(players)} players')
        shuffled_deck = utils.shuffle_deck(deck)
        socketio.emit('distribute', (players, shuffled_deck))
    else:
        print('game is already in progress')

if __name__=='__main__':
	socketio.run(app)
