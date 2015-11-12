    /**********************************************
     * 
     *   Esse arquivo deverá ser utilizado pelos
     *   fornecedores dos Objetos de Aprendizagem
     * 
     **********************************************/

    var HOST_PLATAFORMA = 'http://localhost:61351';

    /* Pseudo-classe da API da Plataforma Conecturma */
    var ApiPlataformaConecturma = function () {
        var self = this;

        self.obterNomeUsuario = function (parametros) {
            enviarMensagemParaPlataforma("obterNomeUsuario", parametros);
        };

        self.registrarConclusao = function (parametros) {
            enviarMensagemParaPlataforma("registrarConclusao", parametros);
        };

        self.verificarConclusoesObjetosAprendizagem = function (parametros) {
            enviarMensagemParaPlataforma("verificarConclusoesObjetosAprendizagem", parametros);
        };

        self.obterPremiacao = function (parametros) {
            enviarMensagemParaPlataforma("obterPremiacao", parametros);
        };

        self.obterUltimaConclusao = function (parametros) {
            enviarMensagemParaPlataforma("obterUltimaConclusao", parametros);
        };

        self.obterFaseInicialParaExecucao = function (parametros) {
            enviarMensagemParaPlataforma("obterFaseInicialParaExecucao", parametros);
        };

        self.verificarAcessoUniverso = function (parametros) {
            enviarMensagemParaPlataforma("verificarAcessoUniverso", parametros);
        };

        self.verificarAcessoAventura = function (parametros) {
            enviarMensagemParaPlataforma("verificarAcessoAventura", parametros);
        };

        self.verificarAcessoUnidade = function (parametros) {
            enviarMensagemParaPlataforma("verificarAcessoUnidade", parametros);
        };

        self.verificarAcessoObjetoAprendizagem = function (parametros) {
            enviarMensagemParaPlataforma("verificarAcessoObjetoAprendizagem", parametros);
        };
    };

    /* Instância global da API da Plataforma Conecturma */
    var apiPlataforma = new ApiPlataformaConecturma();

    /*
     * Armazena todos os parametros das funcoes incluindo os callbacks
     * para evitar ter que passar esse tipo de dado para o outro frame.
     */
    var mapaChamadasFuncoes = [];

    /*
     * Registra listener para receber mensagens postMessage vindas
     * do frame pai, atuando como algo analogo a um middleware.
     */
    window.addEventListener("message", function (event) {
        var resposta = event.data;

        var parametrosOriginais = mapaChamadasFuncoes[resposta.uuid];

        /*
         * Remove o parametro porque nao precisamos mais 
         * dele e tambem para liberar a memoria 
         */
        delete mapaChamadasFuncoes[resposta.uuid];

        /*
         * Remove o atributo uuid para nao expor dados que o
         * consumidor do servico nao precisa
         */
        delete resposta["uuid"];

        if (resposta.tipoErro || (resposta.mensagensErro && resposta.mensagensErro.length > 0)) {
            /* Verifica se o usuario nao passou um callback de erro e, nesse caso, escreve mensagem de erro no log */
            if (!parametrosOriginais.erro) {
                console.error("A operacao retornou um objeto de erro, mas nenhum callback de erro foi informado.");
            } else {
                parametrosOriginais.erro(resposta);
            }
        } else {
            /* Verifica se o usuario nao passou um callback de sucesso e, nesse caso, escreve mensagem de erro no log */
            if (!parametrosOriginais.sucesso) {
                console.error("A operacao retornou com sucesso, mas nenhum callback de sucesso foi informado.");
            } else {
                delete resposta["tipoErro"];
                delete resposta["mensagensErro"];
                parametrosOriginais.sucesso(resposta);
            }
        }
    });

    /**
     * Gera um numero universalmente unico.
     * Utilizado para garantir a unicidade de cada objeto contendo parametros e callback
     */
    function gerarUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /*
     * Envia mensagens para o frame da plataforma via postMessage
     */
    function enviarMensagemParaPlataforma(nomeMetodo, parametros) {
        var uuid = gerarUUID() + "_" + nomeMetodo;

        /* Armazena callbacks para serem chamados quando recebermos a resposta */
        mapaChamadasFuncoes[uuid] = parametros;

        var mensagem = {
            "uuid": uuid,
            "operacao": nomeMetodo
        };

        adicionarParametrosNaMensagem(parametros, mensagem);

        /* Envia a mensagem para o frame pai */
        parent.postMessage(JSON.stringify(mensagem), HOST_PLATAFORMA);
    }

    /* Clona objeto sem callbacks para passar os parametros via mensagem do postMessage */
    function adicionarParametrosNaMensagem(parametros, mensagem) {
        for (var p in parametros) {
            if (parametros.hasOwnProperty(p)) {
                if (p != "sucesso" && p != "erro") {
                    mensagem[p] = parametros[p];
                }
            }
        }
    }

