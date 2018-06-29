var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/loginapp');
var db = mongoose.connection;

// UserSchema

var UserSchema = mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    name:{
        type:String
    }
});

var User = module.exports = mongoose.model('user',UserSchema);

module.exports.CreateUser = function(newUser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            newUser.password = hash;
            newUser.save();
        }); 
    });
}
module.exports.getUserByUsername = function (username,callback) {
    var query = {username:username};
    User.findOne(query,callback);
}

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback); 
}

module.exports.comparePassword = function(candidatPassword,hash,callback){
    // Load hash from your password DB.
    bcrypt.compare(candidatPassword, hash, function(err, res) {
        if(err) throw err;
        callback(null,res);
    });
}