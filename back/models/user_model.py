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
    def add_user(self, username, fname, lname, email, password, city, state, zip):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            INSERT INTO user (username, fname, lname, email, password, city, state, zip)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """

            user_data = (username, fname, lname, email, password, city, state, zip)
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
            cursor = conn.cursor(dictionary=True)

            sql = """
            SELECT * FROM user WHERE username = %s
            """

            cursor.execute(sql, (username,))
            user = cursor.fetchone()
            if user:
                return user['userid'] # Return the userid if the username exists
            return None
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
    
    """Function to check if a user current password is different from the updated password"""
    def different_password(self, userid, new_password):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            SELECT password FROM user WHERE userid = %s
            """
            cursor.execute(sql, (userid,))
            result = cursor.fetchone()
            if result:
                current_hashed_password = result[0]
                return not bcrypt.checkpw(new_password.encode('utf-8'), current_hashed_password.encode('utf-8'))
            return False
        except Error as e:
            print(f"Error checking different password: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to update a user's password"""
    def update_password(self, userid, new_hashed_password):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            UPDATE user SET password = %s WHERE userid = %s
            """
            cursor.execute(sql, (new_hashed_password, userid))
            conn.commit()
            return True
        except Error as e:
            print(f"Error updating password: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    """Function to delete a user"""
    def delete_user(self, userid):
        conn = None
        cursor = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            sql = """
            DELETE FROM user WHERE userid = %s
            """
            cursor.execute(sql, ( userid))
            conn.commit()
            return True # return true if user was deleted
        except Error as e:
            print(f"Error deleting user: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()