from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from database import Database

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jasdhasd!@3ksdjf!@#12214SAD35'
socketio = SocketIO(app, cors_allowed_origins='*')


@socketio.on('message')
def handleMessage(msg):
    database = Database()
    messageid = int(database.get_data()[0]) + 1
    msg['message_id'] = str(messageid)
    messageid += 1
    database.write_data(messageid)
    emit('message', msg, broadcast=True)


@socketio.on('join')
def handle_json(json):
    emit('join', json, broadcast=True)


@socketio.on('delete')
def handle_delete(data):
    emit('delete', data, broadcast=True)


@socketio.on('istyping')
def handle_typing(data):
    emit('istyping', data, broadcast=True)


@app.route('/')
def home():
    return render_template("index.html")


if __name__ == '__main__':
    socketio.run(app)
