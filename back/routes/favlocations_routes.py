from flask import Blueprint, jsonify, request
from models.favlocations_model import FavlocationsModel

favlocations_bp = Blueprint('favlocations', __name__, url_prefix='/favlocations')
favlocations_model = FavlocationsModel()

@favlocations_bp.route('/<int:userid>', methods=['GET'])
def get_favlocations(userid):
    """Endpoint to get favorite locations for a user by userid"""
    locations = favlocations_model.get_favlocations_by_id(userid)

    if locations:
        return jsonify(locations), 200
    else:
        return jsonify({"message": "No favorite locations found"}), 404