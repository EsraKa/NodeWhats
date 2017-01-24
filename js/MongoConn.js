/**
 * Created by frezymboumba on 1/23/17.
 */

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://heroku_97bv3k4p:avvij8adag806vh61f7982n6jr@ds117819.mlab.com:17819/heroku_97bv3k4p';
var assert = require('assert');




function getUsers() {
    MongoClient.connect(url, function (err, database) {
        if (err) {
            console.log("Could not connect to the database");
        } else {
            console.log("Connection established to the database and server");
            collection = database.collection("Users");

            collection.find({}).toArray(function (error, result) {
                if (err) {
                    console.log("Could not fetch the users from the database");
                } else {
                    console.log(result);
                    database.close();
                }
            });
        }
    });
}

function getMessages() {
    MongoClient.connect(url, function (err, database) {
        if (err) {
            console.log("Could not connect to the database");
        } else {
            console.log("Connection established to the database and server");
            collection = database.collection("ChatRoom");

            collection.find({}).toArray(function (error, result) {
                if (err) {
                    console.log("Could not fetch the users from the database");
                } else {
                    console.log(result);
                    database.close();

                }
            });
        }
    });
}

function createUser(username){
    MongoClient.connect(url, function (err, database) {
        if (err) {
            console.log("Could not connect to the database");
        } else {
            console.log("Connection established to the database and server");
            database.collection('Users').insertOne({"username": username}, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a user into the Users collection.");
                database.close();
            });
        }
        ;
    });

}

function postMessage(username,message,date){
    MongoClient.connect(url, function (err, database) {
        if (err) {
            console.log("Could not connect to the database");
        } else {
            console.log("Connection established to the database and server");
            database.collection('ChatRoom').insertOne({"username": username,"message":message,"date":date}, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a message inside the ChatRoom collection.");
                database.close();

            });
        }
    });

}

server.listen(3030);



module.exports.getUsers = getUsers;
module.exports.getMessages = getMessages;
module.exports.postMessage = postMessage;
module.exports.createUser = createUser;
