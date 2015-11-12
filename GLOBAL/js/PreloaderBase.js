/**
* @version    1.0.0
**/

BasicGame.PreloaderBase = function (game) {

    this.background = null;
    this.preloadBar = null;
};

BasicGame.PreloaderBase.prototype = {

    createPreloadEffect: function() {

        var bg = this.add.sprite(this.world.centerX, this.world.centerY, "preloader", "loadingBackground");
        bg.anchor.set(0.5,0.5);
        bg.scale.set(0.4,0.4);
        bg.alpha = 0;

        this.add.tween(bg).to({alpha: 1}, 250, Phaser.Easing.Quadratic.Out, true);
        this.add.tween(bg.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out, true);

        var txt = this.add.sprite(this.world.centerX, this.world.centerY-30, "preloader", "loadingText");
        txt.anchor.set(0.5,0.5);
        txt.scale.set(0.4,0.4);
        txt.alpha = 0;

        this.add.tween(txt).to({alpha: 1}, 250, Phaser.Easing.Quadratic.Out, true, 250);
        this.add.tween(txt.scale).to({x: 1, y: 1}, 250, Phaser.Easing.Quadratic.Out, true, 250).onComplete.add(function() {

            this.preloadEmpty.alpha = 1;
            this.preloadBar.alpha = 1;
            this.effectFinished = true;

        }, this);

        this.preloadEmpty = this.add.sprite(this.world.centerX-175, this.world.centerY,"preloader", 'preloaderBarEmpty');
        this.preloadEmpty.alpha = 0;

        this.preloadBar = this.add.sprite(this.world.centerX-175, this.world.centerY,"preloader", 'preloaderBarFull');
        this.preloadBar.alpha = 0;

        this.load.setPreloadSprite(this.preloadBar);
    },

    getPoints: function() {

        BasicGame.Pontuacao = null;

        if(!BasicGame.isOnline) {
            BasicGame.Pontuacao = {moedas: 0, xp: 0};
            return;         
        }

        
        BasicGame.OnlineAPI.obterPremiacao(
            BasicGame.InitialLevel,
            function(resposta) { // sucesso

                BasicGame.Pontuacao = resposta;
                console.log("Pontuacao", resposta);

            }, function(erro) { // erro
                console.log( erro );
            }
        );

    },

    initPreloaderBase: function () {

        this.ready = false;
        this.effectFinished = false;

        this.createPreloadEffect();

        this.getPoints();

        // ---- HUD -----
        this.load.atlas('hud', 'GLOBAL/images/hud.png', 'GLOBAL/images/hud.json');


        // ---- ANIMATIONS ----
        this.load.atlas('textoVitoria1', 'GLOBAL/images/textoVitoria1.png', 'GLOBAL/images/textoVitoria1.json');
        this.load.atlas('textoVitoria2', 'GLOBAL/images/textoVitoria2.png', 'GLOBAL/images/textoVitoria2.json');
        this.load.atlas('textoVitoria3', 'GLOBAL/images/textoVitoria3.png', 'GLOBAL/images/textoVitoria3.json');
        this.load.atlas('textoVitoria4', 'GLOBAL/images/textoVitoria4.png', 'GLOBAL/images/textoVitoria4.json');
        this.load.atlas('textoVitoria5', 'GLOBAL/images/textoVitoria5.png', 'GLOBAL/images/textoVitoria5.json');

        this.load.atlas('bumbaWin',     'GLOBAL/images/bumba_win.png',  'GLOBAL/images/bumba_win.json');
        this.load.atlas('fredWin',      'GLOBAL/images/fred_win.png',   'GLOBAL/images/fred_win.json');
        this.load.atlas('polyWin',      'GLOBAL/images/poly_win.png',   'GLOBAL/images/poly_win.json');
        this.load.atlas('juniorWin',    'GLOBAL/images/junior_win.png', 'GLOBAL/images/junior_win.json');

        //this.load.atlas('kim',            '../../../../GLOBAL/images/kim.png',        '../../../../GLOBAL/images/kim.json');
        this.load.atlas('kim',          'GLOBAL/images/kim2.png',       'GLOBAL/images/kim2.json');


        // HUD Buttons
        this.load.atlas('hudVitoria',           'GLOBAL/images/hud_vitoria.png',        'GLOBAL/images/hud_vitoria.json');

        // FONTS
        this.load.bitmapFont('Luckiest', 'GLOBAL/font/font.png', "GLOBAL/font/font.fnt");
        this.load.bitmapFont('JandaManateeSolid', 'GLOBAL/font/janda.png', "GLOBAL/font/janda.fnt");
        this.load.bitmapFont('lucky32', 'GLOBAL/font/lucky_small-32.png', "GLOBAL/font/lucky_small-32.fnt");

        this.load.bitmapFont('lucky-32', 'GLOBAL/font/lucky-32.png', "GLOBAL/font/lucky-32.fnt");

        // PLACAR
        this.load.image('placarResumo', 'GLOBAL/images/placar_resumo.png');
        this.load.image('placar', 'GLOBAL/images/placar.png');

        // END GAME
        this.load.image('backgroundWin', 'GLOBAL/images/background_win.png');




        this.load.audio('hitErro',       ['GLOBAL/sound/Hit_Erro.mp3']);
        this.load.audio('hitAcerto',     ['GLOBAL/sound/Hit_Acerto.mp3']);
        this.load.audio('soundVitoria1', ['GLOBAL/sound/vitoria_demais.mp3']);
        this.load.audio('soundVitoria2', ['GLOBAL/sound/vitoria_muito_bem.mp3']);
        this.load.audio('soundVitoria3', ['GLOBAL/sound/parabens_conecturma.mp3']);
        this.load.audio('soundVitoria4', ['GLOBAL/sound/vitoria_uau.mp3']);
        this.load.audio('soundVitoria5', ['GLOBAL/sound/vitoria_vamos_em_frente.mp3']);
        this.load.audio('soundParabens', ['GLOBAL/sound/vitoria_isso_ai.mp3']);

        this.load.audio('backgroundMusic', ['GLOBAL/sound/looping_jogo.mp3']);
    },


    onLoseFocus: function() {
        if(this.game.paused) {
            return;
        }

        //BasicGame.music.stop();
        //BasicGame.music = null;

        this.sound.pauseAll();

        this.tweens.pauseAll();
        this.game.paused = true;

        this.pauseGroup = this.add.group();

        var bmp = this.add.bitmapData(this.game.width, this.game.height);
        bmp.rect(0,0,this.game.width, this.game.height, "rgba(0,0,0,0.5)");
        var img = this.add.image(0,0,bmp, 0, this.pauseGroup);

        var spr = this.add.sprite(this.world.centerX, this.world.centerY, "preloader", "buttonResumeGame", this.pauseGroup);
        spr.anchor.set(0.5,0.5);

        this.game.input.onDown.addOnce(this.resumeGame, this);
    },

    resumeGame: function() {
        if(this.game.paused) {
            this.pauseGroup.destroy(true);
            this.game.paused = false;
            this.sound.resumeAll();
            this.tweens.resumeAll();

            BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        }
    },

    create: function () {
        this.preloadBar.cropEnabled = true;
    },
    
    initGame: function() {
        this.ready = true;
        this.state.start('Game');
        this.game.onBlur.add(this.onLoseFocus, this);
    }

};

