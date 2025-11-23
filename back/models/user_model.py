from mysql.connector import Error
from db_connection import get_db_connection

class UserModel:
    """Function to fetch all users from the jake weather database"""
    def get_all_users(self):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM user
            """

            cursor.execute(sql)
            users = cursor.fetchall()
            return users
        except Error as e:
            print(f"Error fetching users: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()