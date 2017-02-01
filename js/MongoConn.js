/**
 * Created by frezymboumba on 1/23/17.
 */

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://heroku_97bv3k4p:avvij8adag806vh61f7982n6jr@ds117819.mlab.com:17819/heroku_97bv3k4p';
var assert = require('assert');




// Get all the users present in the Chatroom

function getUsers(completion) {
    MongoClient.connect(url, function (err, database) {
        if (err) {
            alert("Could not connect to the database");
        } else {
            collection = database.collection("Users");

            collection.find({}).toArray(function(err, users) {
                if (!err) {
                    database.close();
                    completion(users);

                } else {
                    console.log(err);
                }

            });
        }
    });

}

// Remove user from the ChatRoom

function removeUser(pseudo, completion) {
    MongoClient.connect(url, function (err, database) {
        if (err) {
            alert("Could not connect to the database");
        } else {
            database.collection('Users').deleteOne(
                { "pseudo" : pseudo }), function(err, _) {
                assert.equal(err, null);
                console.log(pseudo + " has been removed.");
                database.close();
                completion();
            }

        }
    });


}

// Get all the messages from MongoDB

function getMessages(completion) {
    MongoClient.connect(url, function (err, database) {
        if (err) {
            alert("Could not connect to the database");
        } else {

            collection = database.collection("ChatRoom");
            collection.find({}).toArray(function (err, messages) {
                if (!err) {
                    database.close();
                    completion(messages);

                } else {
                    console.log(err);
                }

            });
        }

    });
}

// Create and insert new client into MongoDB Users Collecion

function createUser(pseudo,completion){

    MongoClient.connect(url, function (err, database) {
        if (err) {
            alert("Could not connect to the database");
        } else {
            database.collection('Users').insertOne({"pseudo": pseudo, "isOnline":true}, function(err, result) {
                assert.equal(err, null);
                console.log(pseudo + " inserted into the Users collection.");
                database.close();
                completion();
            });
        }
        ;
    });

}

// Post and insert new message into MongoDB Chatroom Collection

function postMessage(pseudo,message,completion){
    MongoClient.connect(url, function (err, database) {
        if (err) {
            alert("Could not connect to the database");
        } else {
            console.log("Connection established to the database and server");
            database.collection('ChatRoom').insertOne({"pseudo": pseudo,"message":message}, function(err, result) {
                assert.equal(err, null);
                console.log(pseudo + " inserted a message inside the ChatRoom collection.");
                database.close();
                completion();

            });
        }
    });

}


// Exporting the functions for use outside of this class

module.exports.getUsers = getUsers;
module.exports.getMessages = getMessages;
module.exports.postMessage = postMessage;
module.exports.createUser = createUser;
module.exports.removeUser = removeUser;
