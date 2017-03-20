var Cgt = require('./models/cgt');
var Account = require('./models/account');

function getCgts(res) {
    Cgt.find(function(err, cgts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(cgts); // return all todos in JSON format
    });
}

function getAccounts(res) {
    Account.find(function(err, accounts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(accounts); // return all todos in JSON format
    });
}


module.exports = function(app) {
    // api ---------------------------------------------------------------------
    // ACCOUNTS
    // get all accounts
    app.get('/api/accounts', function(req, res) {
        // use mongoose to get all todos in the database
        getAccounts(res);
    });
    // create cgt and send back all cgts after creation
    app.post('/api/accounts', function(req, res) {
        // create a todo, information comes from AJAX request from Angular
        Account.create({
            account_obj: req.body,
            done: false
        }, function(err, account) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            getAccounts(res);
        });
    });

    formatDate = function(x) {
        var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
        return formattedDate;
    };

    // update a todo
    app.put('/api/accounts/:account_id', function(req, res) {
        Account.findById({ _id: req.params.account_id }, function(err, account) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            var toupdate;
            if (req.body.account_obj.length === undefined) {
                toupdate = req.body.account_obj.account_obj;
            } else {
                toupdate = req.body.account_obj;
            }
            if (account.account_obj.length < req.body.account_obj.length) {

                account.account_obj.push({ name: '', balance: '', rules: '', date: '' });
            }
            for (var i = 0, l = account.account_obj.length; i < l; i++) {
                account.account_obj[i].name = toupdate[i].name;
                account.account_obj[i].balance = toupdate[i].balance;
                account.account_obj[i].rules = toupdate[i].rules;
                account.account_obj[i].date = toupdate[i].date;
            }
            var test4 = new Account(account);
            test4.save(function(err, account) {
                if (err)
                    res.send(err);
                getAccounts(res);
            });

        });
    });
    // delete a account
    app.delete('/api/accounts/:account_id', function(req, res) {
        Account.remove({
            _id: req.params.account_id
        }, function(err, account) {
            if (err)
                res.send(err);
            getAccounts(res);
        });
    });
    // delete sub account
    app.post('/api/accounts/:id/:contentId', function(req, res) {
        var id = req.params.id; // not req.body._id
        var contentId = req.params.contentId; // not req.body._id
        Account.findByIdAndUpdate(id, {
            $pull: {
                account_obj: {
                    _id: contentId //_eventId is string representation of event ID
                }
            }
        }, function(err, account) {
            if (err) {
                console.log('ERROR: ' + err);
            } else {
                getAccounts(res);
            }
        });
    });
    // CGTS
    // get all cgts
    app.get('/api/cgts', function(req, res) {
        // use mongoose to get all todos in the database
        getCgts(res);
    });
    // create cgt and send back all cgts after creation
    app.post('/api/cgts', function(req, res) {
        // create a todo, information comes from AJAX request from Angular
        Cgt.create({
            cgt_obj: req.body,
            done: false
        }, function(err, cgt) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            getCgts(res);
        });
    });


    formatDate = function(x) {
        var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
        return formattedDate;
    };

    // update a cgt
    app.put('/api/cgts/:cgt_id', function(req, res) {
        Cgt.findById({ _id: req.params.cgt_id }, function(err, cgt) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            var toupdate;
            if (req.body.cgt_obj.length === undefined) {
                toupdate = req.body.cgt_obj.cgt_obj;
            } else {
                toupdate = req.body.cgt_obj;
            }
            if (cgt.cgt_obj.length < req.body.cgt_obj.length) {
                cgt.cgt_obj.push({ rate: '', startdate: '', enddate: ''});
            }
            for (var i = 0, l = cgt.cgt_obj.length; i < l; i++) {
                cgt.cgt_obj[i].rate = toupdate[i].rate;
                cgt.cgt_obj[i].startdate = toupdate[i].startdate;
                cgt.cgt_obj[i].enddate = toupdate[i].enddate;

            }
            var test6 = new Cgt(cgt);
            test6.save(function(err, cgt) {
                if (err)
                    res.send(err);
                getCgts(res);
            });

        });
    });

    // delete a cgt
    app.delete('/api/cgts/:cgt_id', function(req, res) {
        Cgt.remove({
            _id: req.params.cgt_id
        }, function(err, cgt) {
            if (err)
                res.send(err);
            getCgts(res);
        });
    });
    // delete sub cgt
    app.post('/api/cgts/:id/:contentId', function(req, res) {
        var id = req.params.id; // not req.body._id
        var contentId = req.params.contentId; // not req.body._id
        Cgt.findByIdAndUpdate(id, {
            $pull: {
                cgt_obj: {
                    _id: contentId //_eventId is string representation of event ID
                }
            }
        }, function(err, cgt) {
            if (err) {
                console.log('ERROR: ' + err);
            } else {
                getCgts(res);
            }
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
