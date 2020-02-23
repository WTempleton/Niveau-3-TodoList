var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://test:test@cluster0-mrlww.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true }); 

var todoSchema = new mongoose.Schema({
    item: String,
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = function(app){

app.get('/index', function(req,res){
    Todo.find({}, function(err, data){
        if (err) throw err;
        res.render("index", {todo: data});
    });
});

app.get('/index/:item', function(req,res){
    Todo.find({item: req.params.item}, function(err, data){
        if (err) throw err;
        res.send({item: req.params.item})
    });
});

app.post('/index', urlencodedParser, function(req,res){
    if (req.body.item===''){
        Todo.find({}, function(err, data){
            if (err) throw err;
            res.render("index", {todo: data})
        })
    }
    else{
        Todo(req.body).save(function(err, data){
            if (err) throw err;
            Todo.find({}, function(err, data){
                if (err) throw err;
                res.render("index", {todo: data});
            });
        });
    };
})


app.delete('/index/:item', urlencodedParser, function(req,res){
    Todo.deleteOne({item: req.params.item},(err, other) => {
        if (err) throw err;
      });
      Todo.find({}, function(err, data){
        if (err) throw err;
        const filtered = data.filter(function(el){
            return el.item !== req.params.item
        }) ;
        res.render('index', {todo: filtered});
    });
});

};