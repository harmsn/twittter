var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
})
accountSchema.pre('save',function(next){
    var account= this;
    next();
});
accountSchema.methods.compare = function(pw){
    return pw ===this.password;
}
module.exports=mongoose.model('account',accountSchema);