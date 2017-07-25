// module Node.Express.App

exports.mkApplication = function() {
    var express = require('express');
    return express();
}

exports._listenHttp = function(app) {
    return function(port) {
        return function(cb) {
            return function() {
                var http = require('http');
                var server = http.createServer(app);
                server.listen(port, function(e) {
                    return cb(e)();
                });
                return server;
            }
        }
    }
}

exports._listenHttps = function(app) {
    return function(port) {
        return function(opts) {
            return function(cb) {
                return function() {
                    var https = require('https');
                    var server = https.createServer(opts, app);
                    server.listen(port, function(e) {
                        return cb(e)();
                    });
                    return server;
                }
            }
        }
    }
}

exports._listenPipe = exports._listenHttp;

exports._http = function (app, method, route, handler) {
    return function () {
        app[method](route, function(req, resp, next) {
            return handler(req)(resp)(next)();
        });
    };
};

exports._httpMw = function (app, method, route, handlers) {
    return function () {
        app[method](route, handlers.map(function(f) {
            return function(req, res, next) {
                return f(req)(res)(next)();
            }
        }));
    };
};

exports._use = function (app, mw) {
    return function () {
        app.use(function(req, resp, next) {
            return mw(req)(resp)(next)();
        });
    };
};

exports._useAt = function (app, route, mw) {
    return function () {
        app.use(route, function(req, resp, next) {
            return mw(req)(resp)(next)();
        });
    };
};

exports._useOnParam = function (app, name, cb) {
    return function () {
        app.param(name, function(req, resp, next, val) {
            return cb(val)(req)(resp)(next)();
        });
    };
};

exports._useOnError = function (app, cb) {
    return function () {
        app.use(function(err, req, resp, next) {
            return cb(err)(req)(resp)(next)();
        });
    };
};

exports._getProp = function (app, name) {
    return function () {
        return app.get(name);
    };
};

exports._setProp = function (app, name, val) {
    return function () {
        app.set(name, val);
    };
};

exports._useExternal = function (app, mw) {
    return function () {
        app.use(mw);
    };
};
