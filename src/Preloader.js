BasicGame.Preloader = function (game) {

    this.initExtends();

    BasicGame.PreloaderBase.call(game);
};

BasicGame.Preloader.prototype = Object.create(BasicGame.PreloaderBase.prototype);
BasicGame.Preloader.prototype.constructor = BasicGame.Preloader;

BasicGame.Preloader.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Preloader.prototype[name] = this.extends[name];
    }
};

BasicGame.Preloader.prototype.extends = {

	preload: function () {

		this.initPreloaderBase();

        this.load.image('arrow', 'GLOBAL/images/arrow.png');
        this.load.atlas('clickAnimation', 'GLOBAL/images/click_animation.png', 'GLOBAL/images/click_animation.json');

		
		// SCENE
		this.load.image('background', 'images/background.png');
		this.load.image('frente', 'images/frente.png');

		// CHARACTER ANIMATION
		this.load.atlas('curupira', 'images/anim_menino.png', 'images/anim_menino.json');
		this.load.atlas('formas', 'images/formas.png', 'images/formas.json');
		this.load.atlas('nome_formas', 'images/nome_formas.png', 'images/nome_formas.json');
		
		this.load.image('imgResumo2', 'images/resumo_triangulo.png');
		this.load.image('imgResumo3', 'images/resumo_quadrado.png');
		this.load.image('imgResumo4', 'images/resumo_retangulo.png');
		
		this.load.audio('soundP1', ['sound/UV1AV2UD3OA1_P1.mp3']);
		this.load.audio('soundP2', ['sound/UV1AV2UD3OA1_P2.mp3']);
		this.load.audio('soundP4', ['sound/UV1AV2UD3OA1_P3.mp3']);
		this.load.audio('soundP3', ['sound/UV1AV2UD3OA1_P4.mp3']);

	
		this.load.audio('soundDica', ['sound/UV1AV2UD3OA1_DICA.mp3']);
		this.load.audio('soundFinal', ['sound/UV1AV2UD3OA1_FINAL.mp3']);
		this.load.audio('soundResumo', ['sound/UV1AV2UD3OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', ['sound/UV1AV2UD3OA1_INTRO.mp3']);

	},


	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
