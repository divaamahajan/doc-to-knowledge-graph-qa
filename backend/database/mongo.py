from pymongo import MongoClient
import environment

MONGO_URI = environment.MONGO_URI
DB_NAME = environment.DB_NAME

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
