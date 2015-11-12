if (window.BasicGame === undefined) {
    BasicGame = {};
}

BasicGame.OnlineAPI = {

    HOST_PLATAFORMA: 'http://conecturma-env-teste.elasticbeanstalk.com/',
    // HOST_PLATAFORMA: 'http://localhost',

    mapaChamadasFuncoes: [],

    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    initialize: function(isOnline) {

        this.isOnline = isOnline;

        console.log("BasicGame.OnlineAPI.initialize-", parent);

        if(!isOnline) {
            return;
        }

        this.mapaChamadasFuncoes = [];

        var _this = this;

        window.addEventListener("message", function (event) {

            var resposta = (event.data);

            var parametrosOriginais = _this.mapaChamadasFuncoes[resposta.uuid];
            console.log(resposta);
            console.log(parametrosOriginais);

            if (resposta.tipoErro || (resposta.mensagensErro && resposta.mensagensErro.length > 0)) {
                if (!parametrosOriginais.erro) {
                    console.error("A operacao retornou um objeto de erro, mas nenhum callback de erro foi informado.");
                } else {
                    parametrosOriginais.erro(resposta);
                }
            } else {
                
                if (parametrosOriginais == null || !parametrosOriginais.sucesso) {
                    console.error("A operacao retornou com sucesso, mas nenhum callback de sucesso foi informado.");
                } else {
                    parametrosOriginais.sucesso(resposta);
                }
            }
        });
    },
    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    gerarUUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    enviarMensagemParaPlataforma: function(nomeMetodo, parametros) {
        var uuid = this.gerarUUID() + "_" + nomeMetodo;

        this.mapaChamadasFuncoes[uuid] = parametros;

        var mensagem = {
            "uuid": uuid,
            "operacao": nomeMetodo
        };

        this.adicionarParametrosNaMensagem(parametros, mensagem);

        parent.postMessage(JSON.stringify(mensagem), this.HOST_PLATAFORMA);
    },
    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    adicionarParametrosNaMensagem: function(parametros, mensagem) {
        for (var p in parametros) {
            if (parametros.hasOwnProperty(p)) {
                if (p != "sucesso" && p != "erro") {
                    mensagem[p] = parametros[p];
                }
            }
        }
    },

    /********************************** AUXILIARES ***********************************************/
    
    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method getOA
    */
    getOA: function(oa) {
        return "UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + "OA0" + (oa || BasicGame.OA);
    },

    getUV: function(uv) {
        return "UV" + (uv || BasicGame.UV);
    },
    getAV: function(av) {
        return "UV" + BasicGame.UV + "AV" + (av || BasicGame.AV);
    },
    getUD: function(ud) {
        return "UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + (ud || BasicGame.UD);
    },

    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    getVideo: function(video) {
        return "UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + video;
    },

    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method getOAByName
    */
    getOAByName: function(name) {
        return parseInt(name.split("OA")[1]);
    },
    getUVByName: function(name) {
        return parseInt(name.split("UV")[1]);
    },
    getAVByName: function(name) {
        return parseInt(name.split("AV")[1]);
    },
    getUDByName: function(name) {
        return parseInt(name.split("UD")[1]);
    },

    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    getVideoByName: function(name) {
        return name.split("UD" + BasicGame.UD)[1];
    },
    
    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    isVideo: function(name) {
        return name.match(/(CN|VC)/gi);
    },


    /********************************** PUBLICAS PRONTAS ***********************************************/

    /**
    * chamar ao final do jogo para abrir nivel seguinte no mapa
    *
    * @method setCookieVictory
    */
    obterNomeUsuario: function (onSuccess) { // OK
        
        var param = {
            sucesso: onSuccess
        };

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("obterNomeUsuario", param);
        } else {
            onError(null);
        }
    },
    obterFaseInicialParaExecucao: function(onSuccess, onError) { // OK

        var param = {
            objetoAprendizagem: this.getOA(),
            sucesso: onSuccess,
            erro: onError
        };

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("obterFaseInicialParaExecucao", param);
        } else {
            onError(null);
        }
    },

    registrarConclusao: function (corrects, completed, onSuccess, onError) { // OK

        var _hasError = true;
        for(var i = 0; i < corrects.length; i++) {
            if(corrects[i] >= 0) {
                _hasError = false;
            }
        }
        if(_hasError) {
            onError(null);
            return;
        }

        var _fac = { 
            nivel: "facil",
            percentualConcluido: corrects[0],
            termino: completed[0]
        };
        var _med = { 
            nivel: "medio",
            percentualConcluido: corrects[1],
            termino: completed[1]
        };
        var _dif = { 
            nivel: "dificil",
            percentualConcluido: corrects[2],
            termino: completed[2]
        };

        var param = {
            objetoAprendizagem: this.getOA(),
            niveis: [],
            sucesso: onSuccess,
            erro: onError
        };

        if(corrects[0]>=0) {
            param.niveis.push(_fac);
        }
        if(corrects[1]>=0) {
            param.niveis.push(_med);
        }
        if(corrects[2]>=0) {
            param.niveis.push(_dif);
        }

        console.log('registrarConclusao', param);

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("registrarConclusao", param);
        } else {
            onError(null);
        }
    },

    logSuccess: function(data) {
        console.log("onSuccess", data);
    },
    logError: function(data) {
        console.log("onError", data);
    },

    registrarConclusaoVideo: function(video, onSuccess, onError) {

        var _success = onSuccess || this.logSuccess;
        var _error = onError || this.logError;

        var param = {
            objetoAprendizagem: this.getVideo(video),
            niveis: [
                { nivel: "facil",  percentualConcluido: 100, termino: true },
                { nivel: "medio",  percentualConcluido: 100, termino: true },
                { nivel: "dificil",percentualConcluido: 100, termino: true }
            ],
            sucesso: _success,
            erro: _error
        };

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("registrarConclusao", param);
        } else {
            _error(null);
        }
    },


    obterPremiacao: function(nivel, onSuccess, onError) { // OK

        var _niveis = [null,"FACIL", "MEDIO", "DIFICIL"];

        var param = {
            objetoAprendizagem: this.getOA(),
            // nivel: _niveis[nivel],
            sucesso: onSuccess,
            erro: onError
        };

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("obterPremiacao", param);
        } else {
            onError(null);
        }
    },

    verificarAcessoUniverso: function(onSuccess, onError) {

        var uvs = [];
        for(var i = 1; i <= BasicGame.LEVELS; i++) {
            uvs.push( this.getUV(i) );
        }

        var param = {
            universos: uvs,
            sucesso: onSuccess,
            erro: onError
        };

        //console.log(param);

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("verificarAcessoUniverso", param);
        } else {
            onError(null);
        }
    },

    verificarAcessoAventura: function(onSuccess, onError) {

        var avs = [];
        for(var i = 1; i <= BasicGame.LEVELS; i++) {
            avs.push( this.getAV(i) );
        }

        var param = {
            aventuras: avs,
            sucesso: onSuccess,
            erro: onError
        };

        //console.log(param);

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("verificarAcessoAventura", param);
        } else {
            onError(null);
        }
    },

    verificarAcessoUnidade: function(onSuccess, onError) {

        var uds = [];
        for(var i = 1; i <= BasicGame.LEVELS; i++) {
            uds.push( this.getUD(i) );
        }

        var param = {
            unidades: uds,
            sucesso: onSuccess,
            erro: onError
        };

        //console.log(param);

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("verificarAcessoUnidade", param);
        } else {
            onError(null);
        }
    },
    verificarAcessoObjetoAprendizagem: function(onSuccess, onError) {
        var oas = [];
        for(var i = 1; i <= BasicGame.LEVELS; i++) {
            oas.push( this.getOA(i) );
        }
        oas.push(this.getVideo("CN01"));
        oas.push(this.getVideo("CN02"));
        oas.push(this.getVideo("VC01"));

        var param = {
            objetosAprendizagem: oas,
            sucesso: onSuccess,
            erro: onError
        };

        //console.log(param);

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("verificarAcessoObjetoAprendizagem", param);
        } else {
            onError(null);
        }
    },

    verificarConclusoesObjetosAprendizagem: function (onSuccess, onError) {

        var oas = [];
        for(var i = 1; i <= BasicGame.LEVELS; i++) {
            oas.push( this.getOA(i) );
        }
        oas.push(this.getVideo("CN01"));
        oas.push(this.getVideo("CN02"));
        oas.push(this.getVideo("VC01"));

        var param = {
            objetosAprendizagem: oas,
            sucesso: onSuccess,
            erro: onError
        };

        //console.log(param);

        if(this.isOnline) {
            this.enviarMensagemParaPlataforma("verificarConclusoesObjetosAprendizagem", param);
        } else {
            onError(null);
        }

    },

    obterUltimaConclusao: function (onSuccess, onError) {
        var param = {
            sucesso: onSuccess,
            erro: onError
        };

        this.enviarMensagemParaPlataforma("obterUltimaConclusao", param);
    }
    /********************************** FINAL ***********************************************/

    





};