from flask import Blueprint, jsonify
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