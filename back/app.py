import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

def create_app():
    """
    Creates and configures the Flask application.
    """
    # initialize Flask app
    app = Flask(__name__)

    # ---- Database configuration ----
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{os.environ.get('DATABASE_USER')}:" 
        f"{os.environ.get('DATABASE_PASSWORD')}@"
        f"{os.environ.get('DATABASE_HOST')}:{os.environ.get('DATABASE_PORT')}/"
        f"{os.environ.get('DATABASE_NAME')}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # configure CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # initialize SQLAlchemy
    db = SQLAlchemy(app)

    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to the J.A.K.E. Weather Back!"})
    
    return app

# Gunicorn needs a top-level `app` variable to run
app = create_app()

# if this script is run directly, create and run the app
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)