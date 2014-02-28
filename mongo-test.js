var fs = require("fs")
  , path = require("path")
  , uuid = require("uuid")
  , Schema = require('jugglingdb').Schema;
require("shellshim").globalize();


var hq = path.join(__dirname, "hq");
var db = new Schema('mongodb');

var Model = db.define('Model', {
    username: String,
    modelname: String,
    lang: String,
    timestamp: Number,
    version: String
});

// write some unique data to ensure we'll need to commit
fs.writeFileSync(path.join(hq, "greg", "bundle.json"), uuid.v4().toString());

// add the new model; commit it and then grab the SHA
$("git", "--git-dir", path.join(hq, ".git"),
    "--work-tree", hq, "add", ".");
$("git", "--git-dir", path.join(hq, ".git"),
    "--work-tree", hq, "commit", "--quiet", "--allow-empty-message",
    "-m", "''");
var version = $("git", "--git-dir", path.join(hq, ".git"),
    "--work-tree", hq, "rev-parse", "HEAD").trim();


// save the new model w/ the SHA to the DB
new Model({
  username: "greg",
  modelname: "gregs-model",
  lang: "python",
  timestamp: Date.now(),
  version: version
}).save(function(err) {
  console.log(err);
});
Model.all(function(err, models) {
  if (err) {
    console.log(err.toString());
    return
  }
  // we're just printing to debug
  console.log("models...");
  models.forEach(function(m) {
    console.log(m);
  });
});
