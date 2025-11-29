from mysql.connector import Error
from db_connection import get_db_connection

class FavlocationsModel:
    """Function to fetch favorite locations for a user by userid from the jake weather database"""
    def get_favlocations_by_id(self, userid):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM favlocations WHERE userid = %s
            """

            cursor.execute(sql, (userid,))
            locations = cursor.fetchall()
            return locations
        except Error as e:
            print(f"Error fetching favorite locations: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to add a favorite location for a user"""
    def add_favlocation(self, userid, latitude, longitude, city, state, country, zip):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO favlocations (userid, latitude, longitude, city, state, country, zip)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(sql, (userid, latitude, longitude, city, state, country, zip))
            conn.commit()
            return cursor.lastrowid # Return the locationid of the newly added location
        except Error as e:
            print(f"Error adding favorite location: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to edit a favorite location for a user"""
    def edit_favlocation(self, locationid, latitude, longitude, city, state, country, zip):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            UPDATE favlocations
            SET latitude = %s, longitude = %s, city = %s, state = %s, country = %s, zip = %s
            WHERE locationid = %s
            """

            cursor.execute(sql, (latitude, longitude, city, state, country, zip, locationid))
            conn.commit()
            
            # Check if any row was actually updated
            if cursor.rowcount > 0:
                return locationid
            else:
                return None
        except Error as e:
            print(f"Error editing favorite location: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to delete a favorite location for a user"""
    def delete_favlocation(self, locationid):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            DELETE FROM favlocations WHERE locationid = %s
            """

            cursor.execute(sql, (locationid,))
            conn.commit()
            return True
        except Error as e:
            print(f"Error deleting favorite location: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()