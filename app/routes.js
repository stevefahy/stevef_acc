var Cgt = require('./models/cgt');
var Account = require('./models/account');
var Stock = require('./models/stock');

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

function getStocks(res) {
    Stock.find(function(err, stocks) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(stocks); // return all todos in JSON format
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
/*
    formatDate
 = function(x) {
        var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
        return formattedDate;
    };
    */

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
                account.account_obj[i].startdate = toupdate[i].startdate;
                account.account_obj[i].enddate = toupdate[i].enddate;
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

    // delete a rule
    app.post('/api/accounts/delete/:id/:contentId', function(req, res) {
        var id = req.params.contentId;
        var contentId = req.body.ruleId;
        Account.findById({ _id: req.params.id }, function(err, account) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            var toRemove;
            for (var i = 0, l = account.account_obj.length; i < l; i++) {
                if (account.account_obj[i]._id == req.params.contentId) {
                    for (var t = 0, l2 = account.account_obj[i].rules.length; t < l2; t++) {
                        if (account.account_obj[i].rules[t]._id == contentId) {
                            toRemove = account.account_obj[i].rules[t];
                        }
                    }
                    toRemove.remove();
                }
            }
            var test4 = new Account(account);
            test4.save(function(err, account) {
                if (err)
                    res.send(err);
                getAccounts(res);
            });
        });
    });

    // add a rule
    app.put('/api/accounts/:id/:contentId', function(req, res) {
        Account.findById({ _id: req.params.id }, function(err, account) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            for (var i = 0, l = account.account_obj.length; i < l; i++) {
                if (account.account_obj[i]._id == req.params.contentId) {
                    account.account_obj[i].rules.push(req.body.rule);
                }
            }
            var test4 = new Account(account);
            test4.save(function(err, account) {
                if (err)
                    res.send(err);
                getAccounts(res);
            });
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

/*
    formatDate = function(x) {
        var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
        return formattedDate;
    };
    */

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
                cgt.cgt_obj.push({ rate: '', startdate: '', enddate: '' });
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



    // STOCKS
    // get all stocks
    app.get('/api/stocks', function(req, res) {
        // use mongoose to get all todos in the database
        getStocks(res);
    });
    // create cgt and send back all cgts after creation
    app.post('/api/stocks', function(req, res) {
        // create a todo, information comes from AJAX request from Angular
        Stock.create({
            stock_obj: req.body,
            done: false
        }, function(err, cgt) {
            if (err)
                res.send(err);
            // get and return all the todos after you create another
            getStocks(res);
        });
    });

/*
    formatDate = function(x) {
        var formattedDate = $filter('date')(new Date(x), "yyyy-MM-dd");
        return formattedDate;
    };
    */

    // update a cgt
    app.put('/api/stocks/:stock_id', function(req, res) {
        Stock.findById({ _id: req.params.stock_id }, function(err, stock) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            var toupdate;
            if (req.body.stock_obj.length === undefined) {
                toupdate = req.body.stock_obj.stock_obj;
            } else {
                toupdate = req.body.stock_obj;
            }
            if (cgt.stock_obj.length < req.body.stock_obj.length) {
                stock.stock_obj.push({ rate: '', startdate: '', enddate: '' });
            }
            for (var i = 0, l = stock.stock_obj.length; i < l; i++) {
                stock.stock_obj[i].rate = toupdate[i].rate;
                stock.stock_obj[i].startdate = toupdate[i].startdate;
                stock.stock_obj[i].enddate = toupdate[i].enddate;

            }
            var test6 = new Stock(stock);
            test6.save(function(err, stock) {
                if (err)
                    res.send(err);
                getStocks(res);
            });

        });
    });

    // delete a cgt
    app.delete('/api/stocks/:stock_id', function(req, res) {
        Stock.remove({
            _id: req.params.cgt_id
        }, function(err, cgt) {
            if (err)
                res.send(err);
            getStocks(res);
        });
    });
    // delete sub cgt
    app.post('/api/stocks/:id/:contentId', function(req, res) {
        var id = req.params.id; // not req.body._id
        var contentId = req.params.contentId; // not req.body._id
        Stock.findByIdAndUpdate(id, {
            $pull: {
                stock_obj: {
                    _id: contentId //_eventId is string representation of event ID
                }
            }
        }, function(err, stock) {
            if (err) {
                console.log('ERROR: ' + err);
            } else {
                getStocks(res);
            }
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
