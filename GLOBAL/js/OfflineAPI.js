
if (window.BasicGame === undefined) {
    BasicGame = {};
}

BasicGame.OfflineAPI = {



    OPEN: 1,
    FINISHED: 2,
    /**
    * Verifica se o jogo esta configurado para funcionar online ou offline
    *
    * @method isOnlineMode
    */
    isOnlineMode: function() {

        this.initialize();

        var isOnline = (window.self !== window.top);
        console.log("isOnlineMode",isOnline);

        return isOnline;

        var ca = document.cookie.split(';');

        var cookies = {};
        var item;
        for(var str in ca) {
            item = ca[str].trim().split("=");
            cookies[item[0]] = item[1];
        }
        console.log(cookies);
        if(cookies["ONLINE_MODE"] == null) {
            return true;
        }
        var obj = cookies["ONLINE_MODE"];
        return Boolean(parseInt(obj));
    },

    isVideoOnline: function() {

        var isOnline = (window.parent != window.top);
        console.log("isVideoOnline", isOnline);

        return isOnline;
    },

    initialize: function() {
        console.log(document.title);

        var OA = "";
        var UD = "";
        var AV = "";
        var UV = "";

        if(BasicGame.OA) {
            OA = " - Objeto de Aprendizagem: " + BasicGame.OA;
        } 
        if(BasicGame.UD) {
            UD = " - Unidade: " + BasicGame.UD;
        } 
        if(BasicGame.AV) {
            AV = " - Aventura: " + BasicGame.AV;
        }


        document.title = "CONECTURMA - Universo: " + BasicGame.UV + AV + UD + OA;

    },

    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    setCookieVictory: function() { 
        this.setInitialLevel();
        if(!this.isOnlineMode()) {
            this.setFinished(BasicGame.OA);
            this.unlockLevel(BasicGame.OA+1);
        }
    },

    /**
    * utilizar no mapa para verificar se o level está aberto ou nao
    *
    * @method isLevelOpen
    */
    isLevelOpen: function(OA) {
        var _loaded = this.loadCookie();
        console.log("isLevelOpen", OA, _loaded[OA] == BasicGame.OfflineAPI.OPEN);
        return _loaded[OA] == BasicGame.OfflineAPI.OPEN;
    },
    isLevelFinished: function(OA) {
        var _loaded = this.loadCookie();
        console.log("isLevelFinished", OA, _loaded[OA] == BasicGame.OfflineAPI.FINISHED);
        return _loaded[OA] == BasicGame.OfflineAPI.FINISHED;
    },

    /**
    * Chamado ao inicio do mapa para criar a estrutura de niveis
    *
    * @method setInitialLevel
    */
    setInitialLevel: function(forced) {
        var _old = this.loadCookie();
        if(_old == null || _old.length < BasicGame.LEVELS+2 || forced) {
            var _data = [ ];

            if(BasicGame.isOnline) {
                console.log("online");
                for(var i = 0; i < BasicGame.LEVELS+2; i++) {
                    _data.push( 0 );
                }
            } else {
                console.log("offline");
                for(var i = 0; i < BasicGame.LEVELS+2; i++) {
                    _data.push( ((i <= 1) ? 1 : 0) );
                }
            }
            this.saveCookie(_data);
        }

        var _vOld = this.loadVideoCookie(BasicGame.UD);
        if(_vOld == null) {
            var _vData = {"VC": false, "CN01": false, "CN02": false};
            this.saveVideoCookie(_vData);
        }
    },

    /**
    * verifica se video ja foi tocado ou nao
    *
    * @method getVideo
    */
    getVideo: function(tipo) {
        var _cookied = this.loadVideoCookie();
        return _cookied[tipo];
    },

    /**
    * marca video como salvo
    *
    * @method saveVideo
    */
    saveVideo: function(tipo) {

        var _cookied = this.loadVideoCookie();
        _cookied[tipo] = true;
        this.saveVideoCookie(_cookied);
    },

    /******************* PRIVATE *********************/

    loadVideoCookie: function() {

        var ca = document.cookie.split(';');

        var cookies = {};
        var item;
        for(var str in ca) {
            item = ca[str].trim().split("=");
            cookies[item[0]] = item[1];
        }
        if(cookies["VIDEO.UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD] == null) {
            return null;
        }
        var obj = JSON.parse(cookies["VIDEO.UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD]);
        return obj; 
    },

    saveVideoCookie: function(data) {
        document.cookie = "VIDEO.UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"=" + JSON.stringify(data) + "; path=/";
    },

    saveCookie: function(data) {
        document.cookie = "UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"=" + JSON.stringify(data) + "; path=/";
    },
    loadCookie: function() {

        var ca = document.cookie.split(';');

        var cookies = {};
        var item;
        for(var str in ca) {
            item = ca[str].trim().split("=");
            cookies[item[0]] = item[1];
        }
        if(cookies["UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD] == null) {
            return null;
        }
        var obj = JSON.parse(cookies["UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD]);
        return obj; 
    },

    unlockLevel: function(OA) {
        var _cookied = this.loadCookie();
        if(_cookied[OA] != BasicGame.OfflineAPI.FINISHED) {
            _cookied[OA] = BasicGame.OfflineAPI.OPEN;
            console.log("unlockLevel", _cookied);
            this.saveCookie(_cookied);
        }
    },
    setFinished: function(OA) {
        var _cookied = this.loadCookie();
        _cookied[OA] = BasicGame.OfflineAPI.FINISHED;
        console.log("setFinished", _cookied);
        this.saveCookie(_cookied);
    },

    setAllFinished: function() {
        var _cookied = this.loadCookie();
        for(var i = 0; i <= BasicGame.LEVELS; i++) {
            _cookied[i] = BasicGame.OfflineAPI.FINISHED;
        }
        console.log("setFinished", _cookied);
        this.saveCookie(_cookied);  
    },

    getCookies: function() {

        var ca = document.cookie.split(';');

        var coookies = {};
        var item;
        for(var str in ca) {
            item = ca[str].trim().split("=");
            coookies[item[0]] = parseInt(item[1]);
        }
        return coookies;
    },
    cleanCookie: function() {
        var _date = new Date(0,0,0,0,0,0);
        document.cookie = "UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"=; expires=" + _date + "; path=/";
    },
    cleanVideos: function() {
        var _date = new Date(0,0,0,0,0,0);
        document.cookie = "VIDEO.UV"+BasicGame.UV+"AV"+BasicGame.AV+"UD"+BasicGame.UD+"=; expires=" + _date + "; path=/";
    }
};