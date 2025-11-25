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
    
@user_bp.route('/exists/<username>', methods=['GET'])
def check_username_exists(username):
    """Endpoint to check if a user's username exists"""
    userid = user_model.username_exists(username)
    return jsonify({"exists": userid is not None, "userid": userid}), 200

@user_bp.route('/login', methods=['POST'])
def login_user():
    """Endpoint to login a user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    userid = user_model.user_exists(username, password)

    if userid:
        return jsonify({"message": "Login successful", "userid": userid}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 500
    
@user_bp.route('/<int:userid>', methods=['GET'])
def get_user(userid):
    """Endpoint to get a user by userid"""
    user = user_model.get_user_by_id(userid)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
@user_bp.route('/diffpass/<int:userid>', methods=['POST'])
def check_different_password(userid):
    """Endpoint to check if a user's current password is different from the updated password"""
    data = request.get_json()

    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    different = user_model.different_password(userid, new_password)
    return jsonify({"different": different}), 200

@user_bp.route('/updatepass/<int:userid>', methods=['PUT'])
def update_user_password(userid):
    """Endpoint to update a user's password"""
    data = request.get_json()

    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    # hash the new password before storing in jake weather db
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

    success = user_model.update_password(userid, hashed_password)

    if success:
        return jsonify({"message": "Password updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update password"}), 500