const {MongoClient}=require("mongodb");

let db;
MongoClient.connect('mongodb://localhost/trackDB', (err, client) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }
  db = client.db("tracksdb");
  console.log("database is connected")
});

const getConnection=()=>db;
module.exports={
    getConnection
}