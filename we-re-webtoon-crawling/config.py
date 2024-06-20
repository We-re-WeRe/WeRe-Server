import os
import sys
from dotenv import load_dotenv

dbConfig = {
    "DATABASE_HOST":'',
    "DATABASE_PORT":'',
    "DATABASE_USER":'',
    "DATABASE_PASSWORD":'',
    "DATABASE_NAME":'',
}
env = "local" #os.getenv('ENV') 
path = '/'.join(sys.path[0].split('/')[:-1]) + f'/we-re-server/.env.{env}'
load_dotenv(path)

for key in dbConfig:
    dbConfig[key] = os.getenv(key)

def getDBConfig():
    return dbConfig