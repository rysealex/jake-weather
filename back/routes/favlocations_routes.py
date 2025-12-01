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
    
@favlocations_bp.route('/add/<int:userid>', methods=['POST'])
def add_favlocation(userid):
    """Endpoint to add a favorite location for a user"""
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    city = data.get('city')
    state = data.get('state')
    zip = data.get('zip')

    locationid = favlocations_model.add_favlocation(userid, latitude, longitude, city, state, zip)

    if locationid:
        return jsonify({"message": "Favorite location successfully added", "locationid": locationid}), 200
    else:
        return jsonify({"message": "Failed to add favorite location"}), 500
    
@favlocations_bp.route('/edit/<int:locationid>', methods=['PUT'])
def edit_favlocation(locationid):
    """Endpoint to edit a favorite location for a user"""
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    city = data.get('city')
    state = data.get('state')
    zip = data.get('zip')

    locationid = favlocations_model.edit_favlocation(locationid, latitude, longitude, city, state, zip)

    if locationid:
        return jsonify({"message": "Favorite location successfully edited", "locationid": locationid}), 200
    else:
        return jsonify({"message": "Failed to edit favorite location"}), 500
    
@favlocations_bp.route('/delete/<int:locationid>', methods=['DELETE'])
def delete_favlocation(locationid):
    """Endpoint to delete a favorite location for a user"""
    success = favlocations_model.delete_favlocation(locationid)

    if success:
        return jsonify({"message": "Favorite location successfully deleted"}), 200
    else:
        return jsonify({"message": "Failed to delete favorite location"}), 500