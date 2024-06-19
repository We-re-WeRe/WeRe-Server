import pymysql
import config

dbConfig = config.getDBConfig()
print(dbConfig)
conn = pymysql.connect(host=dbConfig['DATABASE_HOST'], user=dbConfig['DATABASE_USER'], password=dbConfig['DATABASE_PASSWORD'], db=dbConfig['DATABASE_NAME'], charset='utf8')
cur = conn.cursor()
