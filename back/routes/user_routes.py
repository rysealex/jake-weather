import bcrypt
from flask import Blueprint, jsonify, request
from models.user_model import UserModel

user_bp = Blueprint('user', __name__, url_prefix='/user')
user_model = UserModel()

@user_bp.route('/all', methods=['GET'])
def get_all_users():
    """Endpoint to get all users"""
    users = user_model.get_all_users()

    if users is not None:
        return jsonify(users), 200
    else:
        return jsonify({"message": "Failed to fetch users"}), 500
    
@user_bp.route('/add', methods=['POST'])
def add_user():
    """Endpoint to add a new user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    username = data.get('username')
    fname = data.get('fname')
    lname = data.get('lname')
    email = data.get('email')
    password = data.get('password')
    country = data.get('country')
    city = data.get('city')
    state = data.get('state')
    zip = data.get('zip')

    if not all([username, fname, lname, email, password, country, city, state, zip]):
        return jsonify({"error": "All fields are required"}), 400
    
    # hash the password before storing in jake weather db
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    userid = user_model.add_user(username, fname, lname, email, hashed_password, country, city, state, zip)

    if userid:
        return jsonify({"message": "User added successfully", "userid": userid}), 201
    else:
        return jsonify({"error": "Failed to add user"}), 500