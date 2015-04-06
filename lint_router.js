var LintRouter = {

    create: function(options) {
        var newRouter           = Object.create(this);
        var options             = options || {};
        newRouter._routes       = options.routes || {};
        newRouter._currentRoute = options.currentRoute || null;
        newRouter._routeAdded   = options.routeAdded || null;
        newRouter._routeRemoved = options.routeRemoved || null;
        newRouter._routeChanged = options.routeChanged || null;
        newRouter._tokenRegex   = /^<(int|string):(.*)>/;
        newRouter._watchFreq    = options.watchFreq || 100;
        return newRouter;
    },

    getRoutes: function() {
        return this._routes;
    },

    getRoute: function(route) {
        return this._routes[route];
    },

    addRoute: function(route, callback) {
        this._routes[route] = callback;
        if (null !== this._routeAdded) this._routeAdded();
        if (null !== this._routeChanged) this._routeChanged();
        return this;
    },

    removeRoute: function(route) {
        var route;
        route = this._routes[route];
        delete this._routes[route];
        if (null !== this._routeRemoved) this._routeRemoved();
        if (null !== this._routeChanged) this._routeChanged();
        if (route === this._currentRoute) {
            this.setCurrentRoute(null);
        }
        return this;
    },

    getCurrentRoute: function() {
        return this._currentRoute;
    },

    setCurrentRoute: function(route) {
        this._currentRoute = route;
        if (null !== this._routeChanged) this._routeChanged();
        return this;
    },

    getRouteByHash: function(hash) {
        var hash = hash || document.location.hash;
        hash = hash.indexOf('#') !== -1 ? hash.replace('#', '') : hash;
        var path = '' == hash ? '/' : hash;
        var route = this._routes[path];
        route = route === undefined ? '/404' : route;
        return route;
    },

    watch: function() {

        var _this = this;
        var currentHash = document.location.hash;
        currentHash = currentHash.indexOf('#') !== -1 ? currentHash.replace('#', '') : currentHash;
        currentHash = '' == currentHash ? '/' : currentHash;

        for (var route in _this.getRoutes()) {
            console.log(route);
            console.log(currentHash);
        }

        // var loop = function () {

        // _this.getParams('/programming', '/<string:domain>');

        // // if hash changes, announce
        // if (window.location.hash != currentHash) {

        //     var route    = _this.getRouteByHash();
        //     var is_valid = route !== undefined;

        //     // only change if route exists
        //     if(is_valid){
        //         var previous = _this.getRouteByHash(storedHash);
        //         storedHash   = window.location.hash;
        //         _this.routeChanged.pub({ route:route, previous:previous });
        //     }
        // }

        // };

        // loop forever
        // window.setInterval(loop, this._watchFreq);

    },  

    // /**
    //  * Get params from tokenized string
    //  * @param  {string} route Example: #/path/<int:id>
    //  * @param  {string} hash  Example: #/path/1
    //  * @return {object}       Example: {id:1}
    //  */
    // getParams: function(route, hash){

    //     var params         = {};
    //     var route_segments = route.split('/');
    //     var hash_segments  = hash.split('?')[0].split('/');
    //     var _this          = this;

    //     // loop presumable tokenized segments
    //     _.each(route_segments, function(v, k){

    //         // is this a token?
    //         var isRegex = _this._tokenRegex.test(v);

    //         // if yes, get the value
    //         if(isRegex){
    //             var token = _this._tokenRegex.exec(v)[2];
    //             params[token] = hash_segments[k];
    //         }
    //     });

    //     return params;

    // },

    // /**
    //  * Check if route path matches route syntax
    //  * @param  {string} a route
    //  * @param  {string} b route to test
    //  * @return {boolean}
    //  */
    match: function(a, b) {

        // tokens collected container
        var tokens = [];

        // loop a's items against b's (they need to be the same length)
        _.each(a, function(v, k) {

            // check if it's a perfect match
            var isPerfectMatch = v === b[k];

            // if perfect match, done
            if (isPerfectMatch) {
                tokens.push(true);

                // if not, look for it to match a regex
            } else {

                // is this a properly formatted token (<int:id>)
                var isRegex = scope.regex.test(v);

                // if yes, let's see if this value is of the type specified
                if (isRegex) {

                    // get the type
                    var type = scope.regex.exec(v);

                    // is there a match?
                    var isRegexMatch = scope.validate_type(type[1], b[k]);

                    // if yes, add the value, if false, not a match
                    if (isRegexMatch) {
                        tokens.push(true);
                    } else {
                        tokens.push(false);
                    }

                    // if no, it's not a regex, it's not a match
                } else {
                    tokens.push(false);
                }

            }

        });

        // if any part of the route was wrong, it's not a match
        var isMatch = !_.contains(tokens, false);

        // return result
        return isMatch;

    },

    // /**
    //  * Validate Type
    //  * @param  {string} type   type
    //  * @param  {string|number} param parameter
    //  * @return {boolean}       
    //  */
    // validate_type: function(type, param){

    //     var result;

    //     switch(type) {
    //         case 'int':
    //             result = !isNaN(param);
    //             break;
    //         case 'string':
    //             result = isNaN(param);
    //             break;
    //         default:
    //             result = false;
    //     }

    //     return result;

    // },

};
