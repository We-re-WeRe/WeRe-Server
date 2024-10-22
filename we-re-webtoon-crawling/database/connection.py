import pymysql
import config

def connectWithDatabase():
    dbConfig = config.getDBConfig()
    conn = pymysql.connect(host=dbConfig['DATABASE_HOST'], user=dbConfig['DATABASE_USER'], password=dbConfig['DATABASE_PASSWORD'], db=dbConfig['DATABASE_NAME'], charset='utf8')
    return conn

def getCursor():
    conn = connectWithDatabase()
    cur = conn.cursor()
    return cur