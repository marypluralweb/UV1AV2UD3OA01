
window.addEventListener("message", function(event) {
    //console.log("PostMessage recebido.");
    //console.log("origin: " + event.origin);
    //console.log("source: " + event.source);
    //console.log("data: " + event.data);

    var parametros = JSON.parse(event.data);
    console.log("parametros pos-parsing: ", parametros);

    var resposta;
    try {
        resposta = simularResposta(parametros);
    } catch (ex) {
	resposta = {
	    "tipoErro": "inesperado",
	    "mensagensErros": "Ocorreu um erro inesperado."
	}
    }
    resposta.uuid = parametros.uuid;

    event.source.postMessage(resposta, event.origin);
});

function simularResposta(parametros) {
    console.log("simularResposta");
    
    var operacao = parametros.operacao;
    console.log("operacao: ", operacao, operacao === 'obterUltimaConclusao');

    var retorno = {};
    retorno.tipoErro = null;
    retorno.mensagensErro = null;

    if (operacao === "obterNomeUsuario") {
        retorno.nomeUsuario = "Homer Simpson";
    } else if (operacao === "registrarConclusao") {
        retorno.moedas = 3;
        retorno.xp = 120;
    } else if (operacao === "verificarConclusoesObjetosAprendizagem") {
        retorno.objetosConcluidos = [ "UV1AV1UD1OA1", "UV1AV1UD1OA2", "UV1AV1UD1OA3" ];
    } else if (operacao === "obterPremiacao") {
        retorno.moedas = 1;
        retorno.xp = 80;
    } else if (operacao === "obterUltimaConclusao") {
        retorno.universo = "UV1";
        retorno.aventura = "UV1AV1";
        retorno.unidade = "UV1AV1UD1";
        //retorno.objetoAprendizagem =  "UV1AV1UD2OA3";
    } else if (operacao === "obterFaseInicialParaExecucao") {
        retorno.nivelInicial = "FACIL";
    } else if (operacao === "verificarAcessoUniverso") {
        retorno.universosAcessiveis = [ "UV1", "UV2" ];
    } else if (operacao === "verificarAcessoAventura") {
        retorno.aventurasAcessiveis = [ "UV1AV1", "UV1AV2", "UV2AV1" ];
    } else if (operacao === "verificarAcessoUnidade") {
        retorno.unidadesAcessiveis = [ "UV1AV1UD1", "UV1AV1UD4", "UV1AV1UD6" ];
    } else if (operacao === "verificarAcessoObjetoAprendizagem") {
        retorno.objetosAprendizagemAcessiveis = [ "UV1AV1UD1OA5","UV1AV1UD1OA6" ];
    }

    return retorno;
}