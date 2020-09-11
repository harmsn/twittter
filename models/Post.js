var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
var Schema = mongoose.Schema;
var postSchema = new Schema({
  post: { type: String, required: true, },
  author: Schema.Types.ObjectId,
  username: {type: String, required: true, },
  likes: { type: Number, ref: 'Account' },
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now() },
      postedBy: { type: ObjectId, ref: 'Account' }
    }
  ]
});

module.exports=mongoose.model('post',postSchema);
