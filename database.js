var mongoose = require('mongoose');
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/lol')
var Champion = mongoose.model('Champion', {id : Number, name: String, title: String,});
Champion.remove({}, function(err){
  console.log(err)
});

var aatrox = new Champion({id : 266, name: "Aatrox", title: "the Darkin Blade",});

aatrox.save(function (err) {
  if (err){
    console.log(err);
  }
});

var thresh = new Champion({id : 412, name: "Thresh", title: "the Chain Warden",});

thresh.save(function (err) {
  if (err){
    console.log(err);
  }
});

mongoose.disconnect(function(err){
  console.log("Disconnected");
})
