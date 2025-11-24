import bcrypt
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

    """Function to add a new user to the jake weather database"""
    def add_user(self, username, fname, lname, email, password, country, city, state, zip):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO user (username, fname, lname, email, password, country, city, state, zip)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            user_data = (username, fname, lname, email, password, country, city, state, zip)
            cursor.execute(sql, user_data)
            conn.commit() # Commit the transaction
            return cursor.lastrowid # Return the ID of the newly created user
        except Error as e:
            print(f"Error creating user: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to check if a user's username exists in the jake weather database"""
    def username_exists(self, username):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            SELECT COUNT(*) FROM user WHERE username = %s
            """

            cursor.execute(sql, (username,))
            result = cursor.fetchone()
            return result[0] > 0
        except Error as e:
            print(f"Error checking username existence: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to check if a user exists in the jake weather database"""
    def user_exists(self, username, password):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM user WHERE username = %s
            """
            cursor.execute(sql, (username,))
            user = cursor.fetchone()
            # check if password matches the hashed password in the jake weather database
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return user['userid']
            return None
        except Error as e:
            print(f"Error checking if user exists: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to get a user by userid"""
    def get_user_by_id(self, userid):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM user WHERE userid = %s
            """
            cursor.execute(sql, (userid,))
            user = cursor.fetchone()
            return user
        except Error as e:
            print(f"Error fetching user by userid: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()