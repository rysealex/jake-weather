from flask import Flask, jsonify
from flask_cors import CORS
import db_connection
from routes.user_routes import user_bp
from routes.api_routes import api_bp
from routes.favlocations_routes import favlocations_bp

# initialize the database connection pool
db_connection.init_db_pool()

def create_app():

    # create and configure the app
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # register blueprints here
    app.register_blueprint(user_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(favlocations_bp)

    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to the J.A.K.E. Weather Back!"})
    
    return app

app = create_app()