import sqlite3


class Database:
    def __init__(self):
        self.data = sqlite3.connect('data.db')
        self.my_db = self.data.cursor()
        try:
            self.my_db.execute(f"SELECT * from data_user")
        except:
            self.my_db.execute('CREATE TABLE data_user (message_id LONGTEXT DEFAULT 100, data_id DEFAULT 1)')
            sql = f'INSERT INTO data_user (data_id) VALUES (1)'
            self.my_db.execute(sql)
            self.data.commit()

    def get_data(self):
        self.my_db.execute(f"SELECT * from data_user WHERE data_id = 1")
        return self.my_db.fetchone()

    def write_data(self, data):
        sql = f'UPDATE data_user SET message_id = "{data}" WHERE data_id = 1'
        self.my_db.execute(sql)
        self.data.commit()


