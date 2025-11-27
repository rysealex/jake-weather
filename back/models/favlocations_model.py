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