var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {
        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // update a todo
    app.put('/api/todos/:todo_id', function (req, res) {
        console.log('post: id: ' +  req.params.todo_id + ', text: ' + req.body.text);
        Todo.findById({_id:req.params.todo_id}, function(err, todo) {
            console.log('find id: ' + req.params.todo_id + ', replace with: ' + req.body.text);
            if (err){
                console.log('error');
                res.send(err);
            }
            console.log('found: ' + todo);
            todo.text = req.body.text;
            console.log('update: ' + todo);
            
            var test = new Todo(todo);
            test.save(function (err, todo) {
                if (err) {
                    res.send(err);
                }
                getTodos(res);
            });
        });
    });
    

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        console.log('remove: ' + req.params.todo_id);
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
