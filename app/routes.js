var Tax = require('./models/tax');
var Account = require('./models/account');
var Stock = require('./models/stock');
var History = require('./models/history');

function getTaxs(res) {
    Tax.find(function(err, taxs) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            return res.send(err);
        }
        res.json(taxs); // return all taxs in JSON format
    });
}

function getAccounts(res) {
    Account.find(function(err, accounts) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(accounts); // return all accounts in JSON format
    });
}

function getStocks(res) {
    Stock.find(function(err, stocks) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(stocks); // return all stocks in JSON format
    });
}

function getHistorys(res) {
    History.find(function(err, historys) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(historys); // return all historys in JSON format
    });
}

module.exports = function(app) {
    // api ---------------------------------------------------------------------
    // ACCOUNTS
    // get all accounts
    app.get('/api/accounts', function(req, res) {
        // use mongoose to get all accounts in the database
        getAccounts(res);
    });
    // create account and send back all accounts after creation
    app.post('/api/accounts', function(req, res) {
        // create a account, information comes from AJAX request from Angular
        Account.create({
            account_obj: req.body,
            done: false
        }, function(err, account) {
            if (err)
                res.send(err);
            // get and return all the accounts after you create another
            getAccounts(res);
        });
    });
    // update a account
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
                account.account_obj[i].currency = toupdate[i].currency;
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
        var id = req.params.id;
        var contentId = req.params.contentId;
        Account.findByIdAndUpdate(id, {
            $pull: {
                account_obj: {
                    _id: contentId
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
    // TAXS
    // get all taxs
    app.get('/api/taxs', function(req, res) {
        // use mongoose to get all taxs in the database
        getTaxs(res);
    });
    // create tax and send back all taxs after creation
    app.post('/api/taxs', function(req, res) {
        // create a tax, information comes from AJAX request from Angular
        Tax.create({
            tax_obj: req.body,
            done: false
        }, function(err, tax) {
            if (err)
                return res.send(err);
            // get and return all the taxs after you create another
            getTaxs(res);
        });
    });
    // update a tax
    app.put('/api/taxs/:tax_id', function(req, res) {
        Tax.findById({ _id: req.params.tax_id }, function(err, tax) {
            if (err) {
                res.send(err);
            }
            var toupdate;
            if (req.body.tax_obj.length === undefined) {
                toupdate = req.body.tax_obj.tax_obj;
            } else {
                toupdate = req.body.tax_obj;
            }
            if (tax.tax_obj.length < req.body.tax_obj.length) {
                tax.tax_obj.push({ tax_type: '', rate: '', startdate: '', enddate: '' });
            }
            for (var i = 0, l = tax.tax_obj.length; i < l; i++) {
                tax.tax_obj[i].tax_type = toupdate[i].tax_type;
                tax.tax_obj[i].rate = toupdate[i].rate;
                tax.tax_obj[i].startdate = toupdate[i].startdate;
                tax.tax_obj[i].enddate = toupdate[i].enddate;
            }
            var test6 = new Tax(tax);
            test6.save(function(err, tax) {
                if (err) {
                    res.send(err);
                }

                getTaxs(res);
            });

        });
    });
    // delete a tax
    app.delete('/api/taxs/:tax_id', function(req, res) {
        Tax.remove({
            _id: req.params.tax_id
        }, function(err, tax) {
            if (err)
                res.send(err);
            getTaxs(res);
        });
    });
    // delete sub tax
    app.post('/api/taxs/:id/:contentId', function(req, res) {
        var id = req.params.id;
        var contentId = req.params.contentId;
        Tax.findByIdAndUpdate(id, {
            $pull: {
                tax_obj: {
                    _id: contentId
                }
            }
        }, function(err, tax) {
            if (err) {
                console.log('ERROR: ' + err);
            } else {
                getTaxs(res);
            }
        });
    });
    // STOCKS
    // get all stocks
    app.get('/api/stocks', function(req, res) {
        // use mongoose to get all stocks in the database
        getStocks(res);
    });
    // create stock and send back all stocks after creation
    app.post('/api/stocks', function(req, res) {
        // create a stock, information comes from AJAX request from Angular
        Stock.create({
            stock_obj: req.body,
            done: false
        }, function(err, stock) {
            if (err)
                res.send(err);
            // get and return all the stocks after you create another
            getStocks(res);
        });
    });
    // update a stock
    app.put('/api/stocks/:stock_id', function(req, res) {
        Stock.findById({ _id: req.params.stock_id }, function(err, stock) {
            if (err) {
                res.send(err);
            }
            var toupdate;
            if (req.body.stock_obj.length === undefined) {
                toupdate = req.body.stock_obj.stock_obj;
            } else {
                toupdate = req.body.stock_obj;
            }
            if (stock.stock_obj.length < req.body.stock_obj.length) {
                stock.stock_obj.push({ ticker: '', price: '', currency: '', forex: '', amount: '', fee: '', startdate: '', enddate: '' });
            }
            for (var i = 0, l = stock.stock_obj.length; i < l; i++) {
                stock.stock_obj[i].ticker = toupdate[i].ticker;
                stock.stock_obj[i].price = toupdate[i].price;
                stock.stock_obj[i].currency = toupdate[i].currency;
                stock.stock_obj[i].forex = toupdate[i].forex;
                stock.stock_obj[i].amount = toupdate[i].amount;
                stock.stock_obj[i].fee = toupdate[i].fee;
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
    // delete a stock
    app.delete('/api/stocks/:stock_id', function(req, res) {
        Stock.remove({
            _id: req.params.stock_id
        }, function(err, stock) {
            if (err)
                res.send(err);
            getStocks(res);
        });
    });
    // delete sub stock
    app.post('/api/stocks/:id/:contentId', function(req, res) {
        var id = req.params.id;
        var contentId = req.params.contentId;
        Stock.findByIdAndUpdate(id, {
            $pull: {
                stock_obj: {
                    _id: contentId
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
    // HISTORYS
    // get all historys
    app.get('/api/historys', function(req, res) {
        // use mongoose to get all historys in the database
        getHistorys(res);
    });
    // create history and send back all historys after creation
    app.post('/api/historys', function(req, res) {
        // create a history, information comes from AJAX request from Angular
        History.create({
            history_obj: req.body,
            done: false
        }, function(err, history) {
            if (err)
                res.send(err);
            // get and return all the historys after you create another
            getHistorys(res);
        });
    });
    // update a history
    app.put('/api/historys/:history_id', function(req, res) {
        History.findById({ _id: req.params.history_id }, function(err, history) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            var toupdate;
            if (req.body.history_obj.length === undefined) {
                toupdate = req.body.history_obj.history_obj;
            } else {
                toupdate = req.body.history_obj;
            }
            if (history.history_obj.length < req.body.history_obj.length) {

                history.history_obj.push({ name: '', balance: '', rules: '', date: '' });
            }
            for (var i = 0, l = history.history_obj.length; i < l; i++) {
                history.history_obj[i].name = toupdate[i].name;
                history.history_obj[i].balance = toupdate[i].balance;
                history.history_obj[i].currency = toupdate[i].currency;
                history.history_obj[i].rules = toupdate[i].rules;
                history.history_obj[i].startdate = toupdate[i].startdate;
                history.history_obj[i].enddate = toupdate[i].enddate;
            }
            var test4 = new History(history);
            test4.save(function(err, history) {
                if (err)
                    res.send(err);
                getHistorys(res);
            });
        });
    });
    // delete a history
    app.delete('/api/historys/:history_id', function(req, res) {
        History.remove({
            _id: req.params.history_id
        }, function(err, history) {
            if (err)
                res.send(err);
            getHistorys(res);
        });
    });
    // delete sub history
    app.post('/api/historys/:id/:contentId', function(req, res) {
        var id = req.params.id;
        var contentId = req.params.contentId;
        History.findByIdAndUpdate(id, {
            $pull: {
                history_obj: {
                    _id: contentId
                }
            }
        }, function(err, history) {
            if (err) {
                console.log('ERROR: ' + err);
            } else {
                getHistorys(res);
            }
        });
    });
    // delete a rule
    app.post('/api/historys/delete/:id/:contentId', function(req, res) {
        var id = req.params.contentId;
        var contentId = req.body.ruleId;
        History.findById({ _id: req.params.id }, function(err, history) {
            if (err) {
                res.send(err);
            }
            var toRemove;
            for (var i = 0, l = history.history_obj.length; i < l; i++) {
                if (history.history_obj[i]._id == req.params.contentId) {
                    for (var t = 0, l2 = history.history_obj[i].rules.length; t < l2; t++) {
                        if (history.history_obj[i].rules[t]._id == contentId) {
                            toRemove = history.history_obj[i].rules[t];
                        }
                    }
                    toRemove.remove();
                }
            }
            var test4 = new History(history);
            test4.save(function(err, history) {
                if (err)
                    res.send(err);
                getHistorys(res);
            });
        });
    });
    // add a rule
    app.put('/api/historys/:id/:contentId', function(req, res) {
        History.findById({ _id: req.params.id }, function(err, history) {
            if (err) {
                res.send(err);
            }
            for (var i = 0, l = history.history_obj.length; i < l; i++) {
                if (history.history_obj[i]._id == req.params.contentId) {
                    history.history_obj[i].rules.push(req.body.rule);
                }
            }
            var test4 = new History(history);
            test4.save(function(err, history) {
                if (err)
                    res.send(err);
                getHistorys(res);
            });
        });
    });
    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
