
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator


    

};

BasicGame.Game.prototype = {


    create: function () {

        /**************************** CONSTANTES GERAIS FIXAS ************************************************/
        this.TEMPO_INTRO = 9000;
        this.TEMPO_ERRO1 = 1000;
        this.SOUND_VITORIA = 5500;

        this.HAS_CALL_TO_ACTION = true;
        /**************************** CONSTANTES GERAIS FIXAS ************************************************/

        /**************************** CONSTANTES JOGO ATUAL ************************************************/
        this.LETTER_SPACING = 60;
        this.UNDERLINE_SPACING = 20;
        /**************************** CONSTANTES JOGO ATUAL ************************************************/

        /* FUTURO XML */
        this.corrects = 0;
        this.errors = 0;
        this.currentLevel = BasicGame.InitialLevel;
        this.listCorrects = [-1,-1,-1];
        this.listCompleted = [false,false,false];
        /* FUTURO XML */
        this.conclusaoEnviada = false;
        /* FUTURO XML */

        this.lives = 2;
        this.points = 0;
        this.showCallToAction = false;

        this.nameShadows = [];
        this.nameTexts = [];
        this.resetRandomLetter();
        //this.gradeGuia();
 
        this.createScene();
        
        // ------- AV2D3OA01 ----- //
        this.groupLevel = []; // salva tudo que compoe o nível 
        this.errou = false; // para a apresentacao show action
        this.subNivel = 1;
        this.initVars(); // variavies do jogo 
        // ------- fim AV2D3OA01 ----- //

        this.showIntro();
        //this.showResumo();
        // this.gameOverMacaco();
        /* HUD */
        this.createBottomHud();
        this.createHud();

        //BasicGame.music = this.sound.play('backgroundMusic', 0.75, true);
        this.textGame();

    },

    textGame:function(){

            this.texto = new Array();
            this.texto['initialText'] = "Na Árvore da Vida, como diz o nome, \ntudo ganha vida. Até as [formas] \n[geométricas].";
            this.texto['initialText2'] ="Nossos amigos encontraram algumas dessas \nformas, que rapidamente se esconderam, \nquerendo brincar de esconde-esconde.";
            this.texto['initialText3'] ="As formas que se esconderam foram o \n[quadrado], o [triângulo] e o [retângulo]. \nVamos ajudar a Conecturma a encontrar \nesses levados? ";
            this.texto['imgResumo'] ="As formas geométricas que procuramos são:";
             
            // em caso de haver mais itens por level é possivel utilizar este array e colocar cada item em ordem
            this.questionList = [ null,
                "Encontrem um [quadrado].",
                "Encontrem os dois [triângulos].",
                "Agora que encontramos as formas geométricas, \nvamos arrastar as formas aos seus nomes. \nVocês conseguem!",
                "Encontrem os três [retângulos]."
                
            ];
    },


    drawText: function(x,y,text, fontSize, align, lineHeight) {

            var _lineHeight = lineHeight || -2;
            var _align = align || "center";

            var textGroup = this.add.group();

            var _width = 0;

            var byLine = text.split("\n");

            var py = 0;

            for(var i = 0; i < byLine.length; i++) {

                var byColor = byLine[i].split(/(\[[^\]]+\])/gi);

                var px = 0;
                var textBase = this.add.sprite(0,0);

                for(var j = 0; j < byColor.length; j++) {
                    
                    var _color = 0xFBFBFB;
                    var _text = byColor[j];
                    if(byColor[j][0] == "[") {

                        _text = " " + byColor[j].replace(/[\[\]]/gi, "");
                        _color = 0xFFD200;

                    } 

                    var s = this.add.bitmapText(1+px,1+py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                    s.tint = 0x010101;

                    var t = this.add.bitmapText(px,py, "lucky-32", _text.toUpperCase(), fontSize || 22);
                    px += t.width;
                    t.tint = _color;
                    
                    textBase.addChild(s);
                    textBase.addChild(t);
                }
                textGroup.add(textBase);

                switch(_align) {
                    case "left":
                        
                    break;
                    case "right":
                        textBase.x -= px;
                    break;
                    case "center":
                        textBase.x -= px*0.5;
                    break;
                }

                py += textBase.height + _lineHeight;

                if(px > _width) {
                    _width = px;
                }
            }

            textGroup.x = x;
            textGroup.y = y;

            switch(_align) {
                case "left":
                    textGroup.x -= _width*0.5;
                break;
                case "right":
                    textGroup.x += _width*0.5;
                break;
                case "center":
                    
                break;
            }

            return textGroup;
    },
    clickRestart:function() {
        this.sound.stopAll();
        this.state.start('Game');
    },

    createBottomHud: function() {
        this.groupBottom = this.add.group();

        var bg = this.groupBottom.create(0, this.game.height, "hud", "hudBottom");
        bg.anchor.set(0,1);

        this.soundButton = this.add.button(80,this.world.height-60, "hud", this.switchSound, this, 'soundOn','soundOn','soundOn','soundOn', this.groupBottom);

        var sTool = this.add.sprite(3,-35, "hud", "soundText");
        sTool.alpha = 0;
        this.soundButton.addChild(sTool);
        this.soundButton.input.useHandCursor = true;

        this.soundButton.events.onInputOver.add(this.onOverItem, this);
        this.soundButton.events.onInputOut.add(this.onOutItem, this);

        var back = this.add.button(10,this.world.height-110, "hud", this.backButton, this, 'backButton','backButton','backButton', 'backButton', this.groupBottom);
        back.input.useHandCursor = true;

        var sTool = this.add.sprite(8,-40, "hud", "backText");
        sTool.alpha = 0;
        back.addChild(sTool);

        back.events.onInputOver.add(this.onOverItem, this);
        back.events.onInputOut.add(this.onOutItem, this);
    },
    onOverItem: function(elem) {
        elem.getChildAt(0).alpha = 1;
    },
    onOutItem: function(elem) {
        elem.getChildAt(0).alpha = 0;
    },

    backButton: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(function() {

            this.time.events.removeAll();
            this.tweens.removeAll();
            this.tweenBack();
            
        }, this);

        this.registrarConclusao();
    },
    tweenBack: function() {
        this.add.tween(this.world).to({alpha: 0}, this.tweenTime, Phaser.Easing.Linear.None, true).onComplete.add(function() {
            //location.href = "../UV" + BasicGame.UV + "AV" + BasicGame.AV + "UD" + BasicGame.UD + "MAPA/";
        }, this);
    },

    switchSound: function() {
        this.game.sound.mute = !this.game.sound.mute;
        var _frame = (this.game.sound.mute)? "soundOff" : "soundOn";
        this.soundButton.setFrames(_frame,_frame,_frame, _frame);
    },

    createHud: function() {

        this.groupHud = this.add.group();

        this.add.sprite(0,0, "hud", 0, this.groupHud);

        this.livesTextShadow = this.add.bitmapText(111,36, "JandaManateeSolid", this.lives.toString(), 18);
        this.livesTextShadow.tint = 0x010101;
        this.groupHud.add(this.livesTextShadow);

        this.livesText = this.add.bitmapText(110,35, "JandaManateeSolid", this.lives.toString(), 18);
        this.groupHud.add(this.livesText);

        this.pointsTextShadow = this.add.bitmapText(51,102, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.pointsTextShadow.tint = 0x010101;
        this.groupHud.add(this.pointsTextShadow);

        this.pointsText = this.add.bitmapText(50,101, "JandaManateeSolid", BasicGame.Pontuacao.moedas.toString(), 18);
        this.groupHud.add(this.pointsText);

        
        var coin = this.add.bitmapText(31,191, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        coin.tint = 0x010101;
        this.groupHud.add(coin);

        var xpt = this.add.bitmapText(30,190, "JandaManateeSolid", BasicGame.Pontuacao.xp.toString(), 18);
        this.groupHud.add(xpt);
    },

    /* -FINAL-    HUD E BOTOES */
    /*********************************************************************************************************************/


    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES AUXILIARES GAMEPLAY */

    openLevel: function() {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }
        if(this.listCorrects[this.currentLevel-1] < 0) {
            this.listCorrects[this.currentLevel-1] = 0;
        }
    },

    saveCorrect: function(porc, completed) {
        if(this.currentLevel < 1 || this.currentLevel > 3) {
            return;
        }

        var _completed = (completed==undefined || completed)?true:false;
        var _porc = porc || 100;

        if(_porc > this.listCorrects[this.currentLevel-1]) {
            this.listCorrects[this.currentLevel-1] = _porc;
        }

        if(!this.listCompleted[this.currentLevel-1]) {
            this.listCompleted[this.currentLevel-1] = _completed;
        }

        console.log("saveCorrect", this.listCorrects, this.listCompleted );
    },
        
    //fixa
    createAnimation: function( x, y, name, scaleX, scaleY) { 
        var spr = this.add.sprite(x,y, name);
        spr.animations.add('idle', null, 18, true);
        spr.animations.play('idle');
        spr.scale.set( scaleX, scaleY);

        return spr;
    }, 

    //fixa
    onButtonOver: function(elem) {
        this.add.tween(elem.scale).to({x: 1.1, y: 1.1}, 100, Phaser.Easing.Linear.None, true);
    },
    //fixa
    onButtonOut: function(elem) {
        this.add.tween(elem.scale).to({x: 1, y: 1}, 100, Phaser.Easing.Linear.None, true);
    },

    createRandomItens: function(itens, num) {
        var _itens = [];

        for(var i = 0; i < num; i++) {
            var n = this.rnd.integerInRange(0, itens.length-1);
            _itens.push(itens[n]);
            itens.splice(n,1);
        }
        return _itens;
    },

    getRandomUniqueItem: function(list, level) {

        var letters = this.getNonRepeatLetter(list, level); // FRE
        var n = this.rnd.integerInRange(0,letters.length-1);

        this.spliceLetter.push( letters[n] );

        return letters[n];
    },

    createDelayTime: function(time, callback) {
        //this.add.tween(this).to({}, time, Phaser.Easing.Linear.None, true).onComplete.add(callback, this);
        this.game.time.events.add(time, callback, this)
    },

    /* -FINAL-   FUNCOES AUXILIARES GAMEPLAY */
    /*********************************************************************************************************************/




    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES FIXAS TODOS JOGO */

    /*skipIntro: function() {
        this.tutorial = false;
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        console.log("skipIntro");
        this.add.tween(this.tutorialText).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialText2).to({alpha:0}, 100, Phaser.Easing.Linear.None, true);
        this.add.tween(this.tutorialText3).to({alpha:0}, 100, Phaser.Easing.Linear.None, true).onComplete.add(
            function(){
                this.add.tween(this.kim).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500)
                this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                    this.add.tween(this.groupIntro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
                }, this);
            }
            , this);

        
    },*/

    skipIntro: function() {
        this.tutorial = false;
        this.tweens.removeAll();
        if(this.soundIntro != null) {
            this.soundIntro.stop();
        }
        console.log("*** skipIntro ***");
        
        this.add.tween(this.groupIntro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
        
    },
    
    skipResumo: function() {
        this.tweens.removeAll();
        if(this.soundResumo != null) {
            this.soundResumo.stop();
        }
        this.add.tween(this.groupIntro).to({y: -300}, 500, Phaser.Easing.Linear.None, true);

        this.gameOverLose();
    },

    // intro-fixa
    showIntro: function() {
        this.groupIntro = this.add.group();
        this.tutorial = true;

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.tutorialPlacar.anchor.set(0.5,0);
        
        this.groupIntro.add(this.tutorialPlacar);

        this.skipButton = this.add.button(230, 220, "hud", this.skipIntro, this,"skipButton","skipButton","skipButton","skipButton");

        this.tutorialPlacar.addChild(this.skipButton);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500)
        .onComplete.add(function(){
            if(this.tutorial){this.showTextoIntro();}
        }
        , this);
    },

    // intro-fixa
    showKim: function() {
        this.kim = this.createAnimation( this.world.centerX-320, 200, 'kim', 1,1);
        this.kim.alpha = 0;

        var rect = new Phaser.Rectangle(0, 0, 250, 40);
        this.kim.crop(rect);

        this.groupIntro.add(this.kim);

        this.add.tween(this.kim).to({y: 30, alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        this.add.tween(rect).to({height: 210}, 500, Phaser.Easing.Linear.None, true);

        this.createDelayTime(7000, function() {
            this.add.tween(this.kim).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
        });
    },

    // intro-fixa
    showTextoIntro: function() {
        //1
        this.tutorialText = this.drawText(this.world.centerX+60, 50, this.texto['initialText'], 22, "left");
        this.tutorialText.alpha = 0;
       
        this.groupIntro.add(this.tutorialText);
        //2
        this.tutorialText2 = this.drawText(this.world.centerX, 30, this.texto['initialText2'], 22, "left");
        this.tutorialText2.alpha = 0;
        
        this.groupIntro.add(this.tutorialText2);
        //3
        this.tutorialText3 = this.drawText(this.world.centerX, 20, this.texto['initialText3'], 22, "left");
        this.tutorialText3.alpha = 0;
       
        this.groupIntro.add(this.tutorialText3);
        
        this.add.tween(this.tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.showKim();
        this.soundIntro = this.setDebugAudio("soundIntro");


        this.createDelayTime(7000, function() {
            this.add.tween(this.tutorialText).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(
            function(){
                this.add.tween(this.tutorialPlacar).to({y: -120}, 500, Phaser.Easing.Linear.None, true, 200).onComplete.add(
                function(){
                    this.add.tween(this.tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 500);
                }
                , this);
            }
            , this);
        });
        
        this.createDelayTime(16000, function() {
            this.add.tween(this.tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
            .onComplete.add(function(){
                this.add.tween(this.tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function(){
                    if(this.tutorial){this.showLiveTutorial();}
                },this)
            },this)
        });

    },

    setDebugAudio: function(audio) {
        this.debugAudio = this.sound.add(audio);
        this.debugAudio.onPlay.add(this.onStartDebugAudio, this);
        this.debugAudio.onStop.add(this.onStopDebugAudio, this);
        this.debugAudio.play();

        return this.debugAudio;
    },

    onStartDebugAudio: function() {
        console.log("onStartDebugAudio");
        this.input.onTap.add(this.onDebuAudio, this);
    },
    onDebuAudio: function() {
        var _timer = this.debugAudio.currentTime/100;
        console.log("Timer Audio:", Math.round(_timer)*100, "ms");
    },
    onStopDebugAudio: function() {
        this.input.onTap.remove(this.onDebuAudio, this);
    },
    
    // resumo-fixa
    showResumo: function() {

        this.groupIntro = this.add.group();

        this.tutorialPlacar = this.add.sprite( this.world.centerX, -300, 'placarResumo');
        this.tutorialPlacar.anchor.set(0.5,0);

        this.skipButton = this.add.button(230, 220, "hud", this.skipResumo, this,"skipButton","skipButton","skipButton","skipButton");
        this.tutorialPlacar.addChild(this.skipButton);

        this.groupIntro.add(this.tutorialPlacar);

        this.add.tween(this.tutorialPlacar).to({y: -40}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showTextResumo, this);
    },

    // resumo-fixa
    hideResumo: function() {
        this.add.tween(this.tutorialPlacar).to({y: -300}, 500, Phaser.Easing.Linear.None, true);
        this.gameOverLose();
    },

    // pontuacao-fixa
    addPoints: function() {
        
        // this.updatePointsText();

    },
    // pontuacao-fixa
    updatePointsText: function() {
        return;
        this.pointsTextShadow.text = this.points.toString();
        this.pointsTextShadow.x = 56 - 10;

        this.pointsText.setText(this.points.toString());
        this.pointsText.x = 55 - 10; // this.pointsText.width*0.5;
    },

    // vidas-fixa
    updateLivesText: function() {
        this.livesText.text = this.lives.toString();
        this.livesTextShadow.text = this.lives.toString();
    },

    // game over-fixa
    gameOverMacaco: function() {

        //está dando probelma no mobile enquanto um jogo sozinho
        //BasicGame.OfflineAPI.setCookieVictory();

        this.sound.play("soundFinal");

        var bg = this.add.sprite(this.world.centerX, this.world.centerY, "backgroundWin");
        bg.anchor.set(0.5,0.5);
        bg.alpha = 0;

        var _animals = ["bumbaWin", "fredWin", "polyWin", "juniorWin"];


        var n = this.rnd.integerInRange(0, _animals.length-1);

        var pos = [510,550,520,525];

        var _name = _animals[n];


        var animal = this.createAnimation( this.world.centerX,pos[n], _name, 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,1);
        animal.alpha = 0;

        this.add.tween(bg).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA);
        this.add.tween(animal).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, this.SOUND_VITORIA+500).onComplete.add(function() {
            animal.animations.play('idle');

            this.showTextVictory();

            this.eventConclusao = new Phaser.Signal();
            this.eventConclusao.addOnce(this.showEndButtons, this);

            this.registrarConclusao();

        }, this);
    },

    registrarConclusao: function() {
        if(this.conclusaoEnviada) {
            return;
        }
        this.conclusaoEnviada = true;

        var _this = this;

        var _hasError = true;
        for(var i = 0; i < this.listCorrects.length; i++) {
            if(this.listCorrects[i] >= 0) {
                _hasError = false;
            }
        }
        if(_hasError) {
            this.eventConclusao.dispatch();
            return;
        }

        if(BasicGame.isOnline) {
            BasicGame.OnlineAPI.registrarConclusao(this.listCorrects, this.listCompleted, function(data) {            
                if(_this.eventConclusao) {
                    _this.eventConclusao.dispatch(data);
                }
            }, function(error) {
                console.log(error)
            });
        } else {
            
            _this.eventConclusao.dispatch();
        }
    },

    showTextVictory: function() {

        var pos = [
            [513,368],
            [505,420],
            [530,407],
            [500,360],
            [525,405]
        ];
        var _angle = [1,1,0,1,1];

        var _curr = this.rnd.integerInRange(0,4);

        if(_curr == 1) {
            _curr = 2;
        }

        this.sound.play("soundVitoria" + (_curr+1));

        
        var animal = this.createAnimation( pos[_curr][0], pos[_curr][1], "textoVitoria" + (_curr+1), 1,1);
        animal.animations.stop();
        animal.anchor.set(0.5,0.5);
        animal.animations.play('idle', 18, false);
        
    },

    createEndButton: function(x,y,scale) {
        var b = this.add.sprite(x, y, "hudVitoria", "botaoVitoria");
        b.anchor.set(0.5,0.5);
        b.scale.set(0.2,0.2);
        b.scaleBase = scale;
        b.alpha = 0;
        b.inputEnabled = true;
        b.input.useHandCursor = true;
        b.events.onInputOver.add(this.onOverEndButton, this);
        b.events.onInputOut.add(this.onOutEndButton, this);

        return b;
    },

    showEndButtons: function(resposta) {

        var _moedas = (resposta != null) ? resposta.moedas : 0;
        var _xp = (resposta != null) ? resposta.xp : 0;

        /************************ b1 ******************************/
        var b1 = this.createEndButton(70,540,1);

        var i1 = this.add.sprite(0,-10,"hudVitoria", "vitoriaSetaCima");
        i1.anchor.set(0.5,0.5);
        i1.alpha = 0;
        b1.addChild(i1);
        this.add.tween(i1).to({alpha: 1, y: -40}, 900, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE);

        var t1 = this.add.bitmapText(0,0, "JandaManateeSolid", _moedas.toString(), 40);
        t1.x = -t1.width*0.5;
        t1.y = -t1.height*0.5;
        b1.addChild(t1);

        var tt1 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn1");
        tt1.anchor.set(0.3,1);
        tt1.alpha = 0;
        b1.tooltip = tt1;
        b1.addChild(tt1);

        /************************ b2 ******************************/
        var b2 = this.createEndButton(180, 540, 1);

        var i2 = this.add.sprite(0,-20,"hudVitoria", "vitoriaGemasIcone");
        i2.anchor.set(0.5,0.5);
        b2.addChild(i2);

        var t2 = this.add.bitmapText(0,0, "JandaManateeSolid", _xp.toString(), 40);
        t2.x = -t2.width*0.5;
        t2.y = -t2.height*0.5;
        b2.addChild(t2);

        var tt2 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn2");
        tt2.anchor.set(0.5,1);
        tt2.alpha = 0;
        b2.tooltip = tt2;
        b2.addChild(tt2);

        /************************ b4 ******************************/
        var b4 = this.createEndButton(940, 550, 0.65);
        b4.events.onInputUp.add(this.clickRestart, this);

        var i4 = this.add.sprite(0,0,"hudVitoria", "vitoriaRepetir");
        i4.anchor.set(0.5,0.5);
        b4.addChild(i4);

        var tt4 = this.add.sprite(0, -50, "hudVitoria", "vitoriaTextoBtn4");
        tt4.anchor.set(0.6,1);
        b4.addChild(tt4);
        tt4.alpha = 0;
        b4.tooltip = tt4;
        tt4.scale.set(1.4);



        this.add.tween(b1).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 500);
        this.add.tween(b1.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 500);


        this.add.tween(b2).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 700);
        this.add.tween(b2.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true, 700);

        this.add.tween(b4).to({alpha:1}, 500, Phaser.Easing.Linear.None, true, 1100);
        this.add.tween(b4.scale).to({x:0.65,y:0.65}, 500, Phaser.Easing.Linear.None, true, 1100);



        this.createDelayTime(5000, this.tweenBack);
    },

    onOverEndButton: function(elem) {
        var sc = elem.scaleBase * 1.1;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true);
    },
    onOutEndButton: function(elem) {
        var sc = elem.scaleBase;
        this.add.tween(elem.scale).to({x: sc, y: sc}, 150, Phaser.Easing.Linear.None, true);
        this.add.tween(elem.tooltip).to({alpha: 0}, 150, Phaser.Easing.Linear.None, true);
    },

    // level-fixa
    initGame: function() {
        if(this.groupIntro != null) {
            this.groupIntro.removeAll(true);
        }
        this.tutorial = false;
        this.placar = this.add.sprite( this.world.centerX, -300, 'placar');
        this.placar.anchor.set(0.5,0);

        this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(this.showNextLevel, this);
    },

    // botoes auxiliar-fixa
    clearButtons: function(clearCorrect) {

        for(var i = 0; i < this.buttons.length; i++) {
            if(clearCorrect) {
                if(this.buttons[i].isCorrect == undefined || !this.buttons[i].isCorrect) {
                    this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                        elem.destroy();
                    });
                }
            } else {
                this.add.tween(this.buttons[i]).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(elem) {
                    elem.destroy();
                });
            }
        }
    },

    // level-fixa
    gotoNextLevel: function() {

        //this.currentLevel++;
        
        if((this.currentLevel== 2) && (this.subNivel==1) )
        {
            this.currentLevel= 2;
            this.subNivel=2;
            //this.corrects--;
        }
        else
        {
            this.corrects++;
            this.saveCorrect();
            this.currentLevel++;
        }

        this.hideAndShowLevel(false);
    },

    // fixa
    hideLevel: function(callback) {
        this.add.tween(this.imageQuestion).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);

        if(callback != null) {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500).onComplete.add(callback, this);
        } else {
            this.add.tween(this.placar).to({y: -300}, 800, Phaser.Easing.Linear.None, true, 500);
        }
    },

    // fixa
    hideAndShowLevel: function() {
        console.log("hideAndShowLevel");
        this.hideLevel(function() {
            console.log("currentLevel "+this.currentLevel);
            console.log("corrects "+this.corrects);
            if(this.currentLevel <= 3 && this.corrects <= 2) {
                if(!this.showCallToAction)
                {
                    this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
                }
                else
                {
                    this.showNextLevel();
                }
            } else {
                this.gameOverMacaco();
            }
        });
    },

    gameOverLose: function() {

        this.eventConclusao = new Phaser.Signal();
        this.eventConclusao.addOnce(this.tweenBack, this);

        this.registrarConclusao();
    },

    /* -FINAL-   FUNCOES FIXAS TODOS JOGOS */
    /*********************************************************************************************************************/



    /*********************************************************************************************************************/
    /* -INICIO-   FUNCOES ESPEFICIAS JOGO ATUAL */

    //---- AV1AV2D3OA01 ---- //

    initVars:function(){// iniciação das variáveis do jogo
        this.esconderijo_forma =new Array ([876,161],
                                  [503,473],
                                  [125,249]
                                 )
        this.esconderijo_nome_forma =new Array ([879,227],
                                  [469,535],
                                  [-84,271]
                                 )
        this.quadrado = 0;
        this.nome_quadrado;
        this.posicao =[0,1,2];
        this.nivelAnterior = 0;
        this.frente =0;
        this.tutorial = false;
        //this.modo =0;
        this.skip = false;
        this.imagens = [];
        this.imagensInteracao = [];
        this.imagens_nome = [];
        this.tolerancia = 0;
        this.interacao = false;
        this.numAcertos = 0;
        //this.efeito =0;
        //this.bloquear =0;
        
        
    },
   
    getRandomUniqueItem: function(list, level) {

        //console.log("---getRandomUniqueItem---");
        var letters = this.getNonRepeatLetter(list, level); // FRE
        //console.log("--> letters "+letters);
        var n = this.rnd.integerInRange(0,letters.length-1);
        //console.log("--> n " + n);

        //console.log("---getRandomUniqueItem---");

        return letters[n];
    },
    getNonRepeatLetter: function(itens, num) {

        var _name = [];

        for(var i = 0; i < itens.length; i++) {
            _name.push(itens[i]);
        }

        for(var i = 0; i < this.spliceLetter[num].length; i++) {
            if(_name.indexOf(this.spliceLetter[num]) >= 0) {
                _name.splice(i,1);
            }
        }

        if(_name.length < 1) {
            return itens;
        }
        return _name;
    },
    resetRandomLetter: function() { 
        this.spliceLetter = [
            null,
            [],
            [],
            [],
            []
        ];
    },
    retirarArrayElemento:function(elem){
        var index = this.temp_array.indexOf(elem);
      
        for (i=index; i<this.temp_array.length-1; i++)
        {
            this.temp_array[i] = this.temp_array[i+1];
        }
        this.temp_array.pop();
    },
    
    sorteio:function(){    
        var item = parseInt(this.getRandomUniqueItem(this.temp_array, 1));   
        this.retirarArrayElemento(item); 
        return item;
    },

    efeitoForma:function(forma,esconderijo){
        // forma 1 = quadrado  forma 2 = triangulo forma 3 = retangulo
        switch(forma)
        {
            case 1:
                this.quadrado.alpha = 1;
                this.add.tween(this.quadrado.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true);
                this.nome_quadrado.alpha = 1;
                this.add.tween(this.nome_quadrado).to({y:303}, 500, Phaser.Easing.Linear.None, true).onComplete.add(
                    function(){
                        this.createDelayTime(500, function() {
                            this.add.tween(this.quadrado).to({x:this.esconderijo_forma[esconderijo][0],y:this.esconderijo_forma[esconderijo][1]}, 500, Phaser.Easing.Linear.None, true);
                            this.add.tween(this.nome_quadrado).to({x:this.esconderijo_nome_forma[esconderijo][0],y:this.esconderijo_nome_forma[esconderijo][1]}, 500, Phaser.Easing.Linear.None, true);
                            //if(!this.tutorial){this.liberar(this.modo);}
                        }); 
                    }
                , this);
            break;
            case 2:
                this.triangulo.alpha = 1;
                this.add.tween(this.triangulo.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true);
                this.nome_triangulo.alpha = 1;
                this.add.tween(this.nome_triangulo).to({y:303}, 500, Phaser.Easing.Linear.None, true).onComplete.add(
                    function(){
                        this.createDelayTime(500, function() {
                            this.add.tween(this.triangulo).to({x:this.esconderijo_forma[esconderijo][0],y:this.esconderijo_forma[esconderijo][1]}, 500, Phaser.Easing.Linear.None, true);
                            this.add.tween(this.nome_triangulo).to({x:this.esconderijo_nome_forma[esconderijo][0],y:this.esconderijo_nome_forma[esconderijo][1]}, 500, Phaser.Easing.Linear.None, true);
                            //if(!this.tutorial){this.liberar(this.modo);}
                        }); 
                    }
                , this);
            break;
            case 3:
                this.retangulo.alpha = 1;
                this.add.tween(this.retangulo.scale).to({x:1,y:1}, 500, Phaser.Easing.Linear.None, true);
                this.nome_retangulo.alpha = 1;
                this.add.tween(this.nome_retangulo).to({y:303}, 500, Phaser.Easing.Linear.None, true).onComplete.add(
                    function(){
                        this.createDelayTime(500, function() {
                            this.add.tween(this.retangulo).to({x:this.esconderijo_forma[esconderijo][0],y:this.esconderijo_forma[esconderijo][1]}, 500, Phaser.Easing.Linear.None, true);
                            this.add.tween(this.nome_retangulo).to({x:this.esconderijo_nome_forma[esconderijo][0],y:this.esconderijo_nome_forma[esconderijo][1]}, 500, Phaser.Easing.Linear.None, true);
                            //if(!this.tutorial){this.liberar(this.modo);}
                        }); 
                    }
                , this);
            break;
        }
        
    },
    
    showForma:function(img,right){
        if(this.imagens[img].id=="retangulo")
        {
            this.createDelayTime(500, function() {
                this.add.tween(this.imagens[img]).to({x:370,y:230}, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens_nome[img]).to({x:293,y:303}, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function(){
                    if(right){
                        this.createDelayTime(1000, function(){this.rightAnswer()}); 
                    }
                ;}, this);
            }); 
        }
        else{
            this.createDelayTime(500, function() {
                this.add.tween(this.imagens[img]).to({x:400,y:230}, 500, Phaser.Easing.Linear.None, true);
                this.add.tween(this.imagens_nome[img]).to({x:293,y:303}, 500, Phaser.Easing.Linear.None, true)
                .onComplete.add(function(){
                    if(right){
                        this.createDelayTime(1000, function(){this.rightAnswer()}); 
                    }
                ;}, this);
            }); 
        }

        
    },


    liberar:function(modo,img){
        switch(modo)
        {
            case 1:// para liberar 
                for(var i=0; i<this.imagens.length;i++)
                {
                    this.imagens[i].inputEnabled = true;
                    this.imagens[i].events.onInputDown.add(this.mouseInputDown, this);
                    this.groupLevel[this.currentLevel].add(this.imagens[i]);
                }
                this.background.inputEnabled = true;
                this.background.events.onInputDown.add(this.mouseInputDown, this);
                
                this.curupira.inputEnabled = true;
                this.curupira.events.onInputDown.add(this.mouseInputDown, this);
                
                this.frente.inputEnabled = true;
                this.frente.events.onInputDown.add(this.mouseInputDown, this);
                
                this.interacao = true;
            break;
            case 2:// para travar em caso de erro
                console.log("--- TUDO travar 2 ---");
                this.interacao = false;
                for(var i=0; i<this.imagens.length;i++)
                {
                    this.imagens[i].inputEnabled = false;
                    this.imagens[i].events.onInputDown.removeAll();
                    this.imagens[i].input.reset();
                }
                
                this.background.inputEnabled = false;
                this.background.events.onInputDown.removeAll();
                this.background.input.reset();
                
                this.curupira.inputEnabled = false;
                this.curupira.events.onInputDown.removeAll();
                this.curupira.input.reset();
                
                this.frente.inputEnabled = false;
                this.frente.events.onInputDown.removeAll();
                this.frente.input.reset();
            break;
            //this.bloquear
            case 3:// para travar em caso de erro
                console.log("---travar 3 " + this.imagens[img].name);
            
                this.imagens[img].inputEnabled = false;
                this.imagensInteracao[img] = false;
                this.imagens[img].input.reset();
                this.imagens[img].events.onInputDown.removeAll();
               
                console.log(this.imagens[img].inputEnabled);

                console.log("---travar 3 " + this.imagens[img].name);

            
            break;
        }
        
    },
    mouseInputDown2:function(elem){
        console.log("--- mouseInputDown2 ---");
    },
    
    mouseInputDown:function(elem){
        
        if(this.interacao)
        {
            var x = Math.round(this.game.input.activePointer.position.x);
            var y = Math.round(this.game.input.activePointer.position.y);
            
            //console.log("x--> "+x);
            //console.log("y--> "+y);
            console.log("name--> "+elem.name);
            
            //x=this.esconderijo_forma[num][0]+this.quadrado.width/2;
            //y=this.esconderijo_forma[num][1]+this.quadrado.height/2;
            
            console.log("tamanho--> "+this.imagens.length);
            this.imagens.length
            for(var i=0; i<this.imagens.length;i++)
            {
    
                pontoX1 = this.imagens[i].x;
                pontoY1 = this.imagens[i].y;
                
                pontoX2 = this.imagens[i].x+(this.imagens[i].width);
                pontoY2 = this.imagens[i].y+(this.imagens[i].width);
                
                //console.log(x + " > " + pontoX1 + " e " + x + " < " + pontoX2 );
                //console.log(y + " > " + pontoY1 + " e " + y + " < " + pontoY2 );
                if((x>pontoX1) && (x < pontoX2))
                {
                    //console.log("true");
                    if((y>pontoY1) && (y< pontoY2))
                    {

                        console.log("correto");
                        console.log("correto "+this.imagensInteracao[i]);
                        if(this.imagensInteracao[i]){
                            teste = true;
                            forma = i;
                            this.liberar(3,forma);
                            this.verificar(forma);
                            return; 
                        }else{
                             return;
                        }
                       
                    }
                    else
                    {
                        console.log("aqui Errado");
                        if(i==(this.imagens.length-1))
                        {
                            if(this.tolerancia==0)
                            {
                                this.verificar("errado");
                                return;
                            }
                            else if(this.tolerancia>0)
                            {
                                console.log("ERRADO tolerancia");
                                this.tolerancia--;
                                this.sound.play("hitErro");
                            }
                            
                        }
                        
                    }
                }
                else
                {
                    console.log("Errado");
                    
                    if(i==(this.imagens.length-1))
                    {
                        this.verificar("errado");
                        return;
                    }
                    
                    
                }
            }
        }
    
    },
    
    verificar:function(forma)
    {
        console.log("verificar");
        
        if(forma=="errado")
        {
            if(this.tolerancia>0)
            {
                console.log("ERRADO tolerancia");
                this.tolerancia--;
                this.sound.play("hitErro");
            }
            else
            {
                console.log("ERRADO");
                this.liberar(2);
                this.sound.play("hitErro");
                this. wrongAnswer();    
            }
        }
        else
        {
            console.log("nome "+this.imagens[forma].name);
            console.log("Aqui CORRETO");
            
            this.sound.play("hitAcerto");
            if(this.numAcertos>0)
            {
               
                this.numAcertos--; 
            }
            if(this.numAcertos==0)
            {
                this.liberar(2);
                this.showForma(forma,true);

                return;
            }
            else
            {   
                this.showForma(forma,false);
                return;
            }
        }
    },

    inputMovableNumbers:function(tipo,img){// habilita o drag em drop
        if(tipo==1)
        {  
            for(var i=0; i<this.imagens.length; i++)
            {
                this.imagens[i].inputEnabled = true;
                this.imagens[i].input.enableDrag(false, true);
                this.imagens[i].id = i;
                this.imagens[i].events.onDragStart.add(this.onStartDragNumber, this);
                this.imagens[i].events.onDragStop.add(this.onStopDragNumber, this);
            }

            for(var i=0; i<this.imagens_nome.length; i++)
            {
                this.game.physics.enable(this.imagens_nome[i], Phaser.Physics.ARCADE);
            }

        }

        if(tipo==2) // desabilitar um 
        {
            this.imagens[img].inputEnabled = false;
            this.imagens[img].input.reset();
        }

        if(tipo==3) // desabilitar todas 
        {
            for(var i=0; i<this.imagens.length; i++)
            {
                this.imagens[i].inputEnabled = false;
                this.imagens[i].input.reset();
            }
        }
    },

    onStartDragNumber: function(elem) {// quando começa o movimento das imagens 
       ////console.log("onStartDragNumber");
       //console.log(elem);
       this.drag = true;
    },

    onStopDragNumber: function(elem, pointer) {
        console.log("*** onStopDragNumber ***");
        this.drag = false;
        teste = this.testOverLap(elem);// testando overlap 
        console.log("teste: "+teste);
        if(teste)
        {
            this.inputMovableNumbers(2,elem.id); // desabilitar os inputs do lemento
            this.sound.play("hitAcerto");
            // efeito 
            this.numAcertos--;
            if(this.numAcertos>0)
            {
                console.log("CERTO");
                this.add.tween(elem).to({x:this.posicaoFinal[elem.id],y:178}, 500, Phaser.Easing.Linear.None, true); 
            } 
            if(this.numAcertos==0)
            {
                console.log("CERTO - rightAnswer");
                //this.liberar(2);
                this.add.tween(elem).to({x:this.posicaoFinal[elem.id],y:178}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.rightAnswer();
                    return;
                },this);
                
            }  
  
        }
        else
        {
            this.sound.play("hitErro");
            if(this.tolerancia==0)
            {
                console.log("ERRADO wrongAnswer");
                this.inputMovableNumbers(3);
                this.add.tween(elem).to({x:elem.pos,y:437}, 500, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.wrongAnswer();
                    return;
                },this);
            }
            if(this.tolerancia>0)
            {
                console.log("TOLREANCIA");
                 this.add.tween(elem).to({x:elem.pos,y:437}, 500, Phaser.Easing.Linear.None, true);
                this.tolerancia--;
            }

            
        }
    },

    testOverLap:function(elem){// teste de overlap (função de teste lógico do jogo)
        console.log("*** testOverLap ****");
        this.game.physics.enable(elem, Phaser.Physics.ARCADE);
        for(var i=0; i<this.imagens_nome.length; i++)
        {
            console.log("forma "+elem.name+ " nome "+this.imagens_nome[i].name);
            this.game.physics.enable(this.imagens_nome[i], Phaser.Physics.ARCADE);
            if(this.game.physics.arcade.overlap(elem,this.imagens_nome[i]))
            {
                if(elem.name==this.imagens_nome[i].name){
                    console.log("CORRETO");
                    
                    return true;
                }
                else
                {
                    if(i==(this.imagens_nome.length-1))
                    {
                        return false;
                    }
                   
                }
            }
        }

        return  false;
        
    },
    
    

    //---- AV1AV2D3OA01 ---- //

   
    /* -FINAL-   FUNCOES ESPEFICIAS JOGO ATUAL */
    /*********************************************************************************************************************/



    


    /*********************************************************************************************************************/    
    /* -INICIO-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */


    createScene: function() {//finished
        
        this.background = this.add.sprite( -567, -558, 'background');
        this.background.scale.set(0.9,0.9);
        this.curupira = this.createAnimation(593,254, 'curupira', 1,1);
        frente_back = this.add.sprite( -480, -200, 'frente');
        frente_back.scale.set(0.9,0.9);

    },
    // tutorial demonstracao - inicio
    showLiveTutorial: function() {
        console.log("*** showLiveTutorial ***");
        this.tutorial = true;

        // quadrado
        this.quadrado = this.add.sprite( 400, 230, 'formas',1);
        this.quadrado.scale.set(0.2,0.2);
        this.quadrado.alpha = 0;
        this.nome_quadrado = this.add.sprite( 293, 601, 'nome_formas',2);
        this.nome_quadrado.alpha = 0;
        this.groupIntro.add(this.quadrado);
        this.groupIntro.add(this.nome_quadrado);
        
        // triangulo
        this.triangulo = this.add.sprite( 400, 230, 'formas',3);
        this.triangulo.scale.set(0.2,0.2);
        this.triangulo.alpha = 0;
        this.nome_triangulo = this.add.sprite( 293, 601, 'nome_formas',0);
        this.nome_triangulo.alpha = 0;
        this.groupIntro.add(this.triangulo);
        this.groupIntro.add(this.nome_triangulo);
        
        // retangulo
        this.retangulo = this.add.sprite( 370, 230, 'formas',2);
        this.retangulo.scale.set(0.2,0.2);
        this.retangulo.alpha = 0;
        this.nome_retangulo = this.add.sprite( 293, 601, 'nome_formas',1);
        this.nome_retangulo.alpha = 0;
        this.groupIntro.add(this.retangulo);
        this.groupIntro.add(this.nome_retangulo);
        
        this.frente = this.add.sprite( -480, -200, 'frente');
        this.frente.scale.set(0.9,0.9);
        this.groupIntro.add(this.frente);
        

        this.createDelayTime(2700, function() {
            if(this.tutorial){
                this.efeitoForma(1,0);
            }
        });
        
        this.createDelayTime(3700, function() {
            if(this.tutorial){
                this.efeitoForma(2,1);
            }
        });
        
        this.createDelayTime(4700, function() {
            if(this.tutorial){
                this.efeitoForma(3,2);
            }
        });
        
        this.createDelayTime(this.TEMPO_INTRO, function() {
            if(this.tutorial)
            {
                this.showFinishedLiveTutorial();
            }
        });
    },
    // tutorial demonstracao - ao clicar no item
    showFinishedLiveTutorial:function() {
        console.log("*** showFinishedLiveTutorial *** ");
        
        this.createDelayTime(1000, function() {
            this.add.tween(this.tutorialText3).to({alpha:0}, 500, Phaser.Easing.Linear.None, true, 500).onComplete.add(
                function(){
                    this.add.tween(this.tutorialPlacar).to({y: -300}, 1000, Phaser.Easing.Linear.None, true, 500).onComplete.add(function(){
                        this.add.tween(this.groupIntro).to({alpha:0}, 500, Phaser.Easing.Linear.None, true).onComplete.add(this.initGame, this);
                    }, this);
                }
                , this);

        });
    },

    // resumo inicial
    showTextResumo: function() {
        var tutorialText = this.drawText(this.world.centerX, 30, this.texto['imgResumo'], 22, "left");//this.add.sprite( this.world.centerX, 70, 'imgResumo');
        tutorialText.alpha = 0;
       

        this.groupIntro.add(tutorialText);
        
        var tutorialText2 = this.add.sprite( this.world.centerX, 160, 'imgResumo2');
        tutorialText2.alpha = 0;
        tutorialText2.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText2);
        
        var tutorialText3 = this.add.sprite( this.world.centerX, 160, 'imgResumo3');
        tutorialText3.alpha = 0;
        tutorialText3.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText3);
        
        var tutorialText4 = this.add.sprite( this.world.centerX, 160, 'imgResumo4');
        tutorialText4.alpha = 0;
        tutorialText4.anchor.set(0.5, 0.5);

        this.groupIntro.add(tutorialText4);
        
        this.add.tween(tutorialText).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        
        this.soundResumo = this.sound.play("soundResumo");
        
        this.createDelayTime(4000, function() {
            this.add.tween(tutorialText2).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });
        
        this.createDelayTime(8000, function() {
            this.add.tween(tutorialText2).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText3).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });
        
        this.createDelayTime(13000, function() {
            this.add.tween(tutorialText3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText4).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
        });

        

        this.soundResumo.onStop.addOnce(function(){
            this.add.tween(tutorialText).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            this.add.tween(tutorialText4).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.hideResumo, this);
        }, this);

    },

    // level - mostrar proximo
    showNextLevel: function() {

        this.openLevel();
        
        switch(this.currentLevel) {
            case 1:
                this.showQuestion(1);
                if(this.showCallToAction) {
                    this.initLevel1();
                } else {
                    this.sound.play("soundP1").onStop.add(this.initLevel1, this);
                }
            break;
            case 2:
                var img = 0;
                var som = null;
                if(this.subNivel==1) {
                    var img = 2;
                    som = "soundP2";
                } else {
                    this.saveCorrect(50,false);
                    var img = 4;
                    som = "soundP4";
                }
                this.showQuestion(img);
                if(this.showCallToAction) {
                    this.initLevel2();
                } else {
                    this.sound.play(som).onStop.add(this.initLevel2, this);
                }
            break;
            case 3:
                this.showQuestion(3);
                if(this.showCallToAction) {
                this.initLevel3();
                } else {
                    this.sound.play("soundP3").onStop.add(this.initLevel3, this);
                }
            break;
        }
        this.showCallToAction = false;
    },

    showQuestion: function(num) {

        var position = 50; 
        if(num==3){position=30;}

        this.imageQuestion = this.drawText(this.world.centerX, position, this.questionList[num]);
        this.imageQuestion.alpha = 0;
        if(this.showCallToAction) {
            return;
        }
        this.add.tween(this.imageQuestion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    },

    
    
    initLevel1: function() {
        console.log("***Nivel 1**** " + this.corrects);
        this.groupLevel[this.currentLevel] = this.add.group();
        this.tolerancia = 1;
        this.numAcertos = 1;
        
        
        if(this.nivelAnterior!=this.currentLevel)
        {
            this.posicao  = [0,1,2];   
        }
        
        this.temp_array = this.posicao.slice();
        var num = this.sorteio(); 
        this.posicao = this.temp_array.slice();

        
        this.quadrado = this.add.sprite( 400, 230, 'formas',1);
        //this.quadrado.scale.set(0.2,0.2);
        this.quadrado.alpha = 0;
        this.quadrado.name = "quadrado";
        this.quadrado.id = "quadrado";
        this.nome_quadrado = this.add.sprite( 293, 601, 'nome_formas',2);
        this.nome_quadrado.alpha = 0;
        this.groupLevel[this.currentLevel].add(this.quadrado);
        this.groupLevel[this.currentLevel].add(this.nome_quadrado);
        this.imagensInteracao.push(true);
        this.imagens.push(this.quadrado);
        this.imagens_nome.push(this.nome_quadrado);
        
        
        
        this.frente = this.add.sprite( -480, -200, 'frente');
        this.frente.name = 'frente';
        this.frente.scale.set(0.9,0.9);
        this.groupLevel[this.currentLevel].add(this.frente);
       
        this.world.bringToTop(this.groupHud);
        this.world.bringToTop(this.groupBottom);
        
        this.createDelayTime(1000, function() {
            //this.efeitoForma(1,num);
            this.quadrado.alpha = 1;
            this.nome_quadrado.alpha = 1;
            
            this.quadrado.x = this.esconderijo_forma[num][0];
            this.quadrado.y = this.esconderijo_forma[num][1];
            
            this.nome_quadrado.x = this.esconderijo_nome_forma[num][0];
            this.nome_quadrado.y = this.esconderijo_nome_forma[num][1];
            
            this.liberar(1);
        });   
    },

    initLevel2: function() {
        console.log("***Nivel 2**** " + this.corrects);
        
        
        
        if(this.subNivel==1)
        {
            console.log("***Nivel 2 -- 1**** " + this.corrects);
            this.esconderijo_forma =new Array ([845,161],
                                              [503,465],
                                              [135,230]
                                             )
            
            this.groupLevel[this.currentLevel] = this.add.group();
            this.numAcertos = 2;
            this.tolerancia = 1;
            
            // triangulo 1
            this.triangulo = this.add.sprite( 400, 230, 'formas',3);
            //this.triangulo.scale.set(0.2,0.2);
            this.triangulo.name = "triangulo";
            this.triangulo.id = "triangulo";
            this.triangulo.alpha = 0;
            this.nome_triangulo = this.add.sprite( 293, 601, 'nome_formas',0);
            this.nome_triangulo.alpha = 0;
            
            this.groupLevel[this.currentLevel].add(this.triangulo);
            this.groupLevel[this.currentLevel].add(this.nome_triangulo);
            this.imagens.push(this.triangulo);
            this.imagensInteracao.push(true);
            this.imagens_nome.push(this.nome_triangulo);
            
            this.temp_array = this.posicao.slice();
            var num = this.sorteio(); // numero do objeto que rima
            this.posicao = this.temp_array.slice();
            
            // triangulo 2
            this.triangulo1 = this.add.sprite( 400, 230, 'formas',3);
            //this.triangulo.scale.set(0.2,0.2);
            this.triangulo1.name = "triangulo1";
            this.triangulo1.id = "triangulo";
            this.triangulo1.alpha = 0;
            this.nome_triangulo1 = this.add.sprite( 293, 601, 'nome_formas',0);
            this.nome_triangulo1.alpha = 0;
            
            this.groupLevel[this.currentLevel].add(this.triangulo1);
            this.groupLevel[this.currentLevel].add(this.nome_triangulo1);
            this.imagens.push(this.triangulo1);
            this.imagensInteracao.push(true);
            this.imagens_nome.push(this.nome_triangulo1);
            
            this.temp_array = this.posicao.slice();
            var num1 = this.sorteio(); 
            this.posicao = this.temp_array.slice();
            
            // cenario frente
            
            this.frente = this.add.sprite( -480, -200, 'frente');
            this.frente.name = 'frente';
            this.frente.scale.set(0.9,0.9);
            this.groupLevel[this.currentLevel].add(this.frente);
            
            //this.efeito = 5;// 
            this.world.bringToTop(this.groupHud);
            this.world.bringToTop(this.groupBottom);
        
            this.createDelayTime(1000, function() {
                //this.efeitoForma(1,num);
                this.triangulo.alpha = 1;
                this.nome_triangulo.alpha = 1;
                
                this.triangulo.x = this.esconderijo_forma[num][0];
                this.triangulo.y = this.esconderijo_forma[num][1];
                
                this.nome_triangulo.x = this.esconderijo_nome_forma[num][0];
                this.nome_triangulo.y = this.esconderijo_nome_forma[num][1];
                
                this.triangulo1.alpha = 1;
                this.nome_triangulo1.alpha = 1;
                
                this.triangulo1.x = this.esconderijo_forma[num1][0];
                this.triangulo1.y = this.esconderijo_forma[num1][1];
                
                this.nome_triangulo1.x = this.esconderijo_nome_forma[num1][0];
                this.nome_triangulo1.y = this.esconderijo_nome_forma[num1][1];
                
                this.liberar(1);
            });
            
            

        }
        
        if(this.subNivel==2)
        {
            console.log("***Nivel 2 -- 2**** " + this.corrects);
            this.esconderijo_forma =new Array ([876,161],
                                              [503,473],
                                              [125,249]
                                             )
            this.groupLevel[this.currentLevel] = this.add.group();
            this.numAcertos = 3;
            this.tolerancia = 1;
            
            // retangulo
            this.retangulo = this.add.sprite( 370, 230, 'formas',2);
            this.retangulo.name = "retangulo";
            this.retangulo.id = "retangulo";
            this.retangulo.alpha = 0;
            this.imagensInteracao.push(true);
            this.nome_retangulo = this.add.sprite( 293, 601, 'nome_formas',1);
            this.nome_retangulo.alpha = 0;
            
            this.groupLevel[this.currentLevel].add(this.retangulo);
            this.groupLevel[this.currentLevel].add(this.nome_retangulo);
            this.imagens.push(this.retangulo);
            this.imagens_nome.push(this.nome_retangulo);
            
            var num = 0; 
            
            // retangulo 1
            this.retangulo1 = this.add.sprite( 370, 230, 'formas',2);
            this.retangulo1.name = "retangulo1";
            this.retangulo1.id = "retangulo";
            this.retangulo1.alpha = 0;
            this.imagensInteracao.push(true);
            this.nome_retangulo1 = this.add.sprite( 293, 601, 'nome_formas',1);
            this.nome_retangulo1.alpha = 0;
            
            this.groupLevel[this.currentLevel].add(this.retangulo1);
            this.groupLevel[this.currentLevel].add(this.nome_retangulo1);
            this.imagens.push(this.retangulo1);
            this.imagens_nome.push(this.nome_retangulo1);
            
            var num1 = 1;

            // retangulo 2
            this.retangulo2 = this.add.sprite( 370, 230, 'formas',2);
            this.retangulo2.name = "retangulo2";
            this.retangulo2.id = "retangulo";
            this.retangulo2.alpha = 0;
            this.imagensInteracao.push(true);
            this.nome_retangulo2 = this.add.sprite( 293, 601, 'nome_formas',1);
            this.nome_retangulo2.alpha = 0;
            
            this.groupLevel[this.currentLevel].add(this.retangulo2);
            this.groupLevel[this.currentLevel].add(this.nome_retangulo2);
            this.imagens.push(this.retangulo2);
            this.imagens_nome.push(this.nome_retangulo2);
            
            var num2 = 2;
            
            // cenario frente
            
            this.frente = this.add.sprite( -480, -200, 'frente');
            this.frente.name = 'frente';
            this.frente.scale.set(0.9,0.9);
            this.groupLevel[this.currentLevel].add(this.frente);
            
            //this.efeito = 5;// 
        
            //___________________________________________________//
            this.world.bringToTop(this.groupHud);
            this.world.bringToTop(this.groupBottom);
            
            this.createDelayTime(1000, function() {
                //this.efeitoForma(1,num);
                // retangulo 
                this.retangulo.alpha = 1;
                this.nome_retangulo.alpha = 1;
                
                this.retangulo.x = this.esconderijo_forma[num][0];
                this.retangulo.y = this.esconderijo_forma[num][1];
                
                this.nome_retangulo.x = this.esconderijo_nome_forma[num][0];
                this.nome_retangulo.y = this.esconderijo_nome_forma[num][1];
                
                // retangulo 1
                this.retangulo1.alpha = 1;
                this.nome_retangulo1.alpha = 1;
                
                this.retangulo1.x = this.esconderijo_forma[num1][0];
                this.retangulo1.y = this.esconderijo_forma[num1][1];
                
                this.nome_retangulo1.x = this.esconderijo_nome_forma[num1][0];
                this.nome_retangulo1.y = this.esconderijo_nome_forma[num1][1];
                
                // retangulo 2
                this.retangulo2.alpha = 1;
                this.nome_retangulo2.alpha = 1;
                
                this.retangulo2.x = this.esconderijo_forma[num2][0];
                this.retangulo2.y = this.esconderijo_forma[num2][1];
                
                this.nome_retangulo2.x = this.esconderijo_nome_forma[num2][0];
                this.nome_retangulo2.y = this.esconderijo_nome_forma[num2][1];
                
                this.liberar(1);
            });
            

        }   
    },

    
    initLevel3: function() {
        console.log("***Nivel 3**** " + this.corrects);
        this.subNivel=1;
        this.groupLevel[this.currentLevel] = this.add.group();
        this.tolerancia = 1;
        this.numAcertos = 3;
        this.posicao = [100,235,370];
        this.posicaoFinal = [];

        // nomes 
        this.nome_quadrado = this.add.sprite(96,250, 'nome_formas',2);
        this.nome_quadrado.name = "quadrado";
        this.groupLevel[this.currentLevel].add(this.nome_quadrado);
        this.imagens_nome.push(this.nome_quadrado);

        this.nome_triangulo = this.add.sprite(365,250, 'nome_formas',0);
        this.nome_triangulo.name = "triangulo";
        this.groupLevel[this.currentLevel].add(this.nome_triangulo);
        this.imagens_nome.push(this.nome_triangulo);
        

        this.nome_retangulo = this.add.sprite(631,250, 'nome_formas',1);
        this.nome_retangulo.name = "retangulo";
        this.groupLevel[this.currentLevel].add(this.nome_retangulo);
        this.imagens_nome.push(this.nome_retangulo);

        this.temp_array = this.posicao.slice();
        var num = this.sorteio(); 
        this.posicao = this.temp_array.slice();

        this.temp_array = this.posicao.slice();
        var num1 = this.sorteio(); 
        this.posicao = this.temp_array.slice();

        this.temp_array = this.posicao.slice();
        var num2 = this.sorteio(); 
        this.posicao = this.temp_array.slice();

        this.quadrado = this.add.sprite(num, 437, 'formas',1);
        this.quadrado.name = "quadrado";
        this.quadrado.pos = num;
        this.groupLevel[this.currentLevel].add(this.quadrado);
        this.imagens.push(this.quadrado);
        this.posicaoFinal.push(191);

        
        this.triangulo = this.add.sprite(num1, 437, 'formas',3);
        this.triangulo.name = "triangulo";
        this.triangulo.pos = num1;
        this.groupLevel[this.currentLevel].add(this.triangulo);
        this.imagens.push(this.triangulo);
        this.posicaoFinal.push(450);

        this.retangulo = this.add.sprite(num2, 437, 'formas',2);
        this.retangulo.name = "retangulo";
        this.retangulo.pos = num2;
        this.groupLevel[this.currentLevel].add(this.retangulo);
        this.imagens.push(this.retangulo);
        this.posicaoFinal.push(695);



        this.createDelayTime(1000, function() {
            //this.posicao = [100,235,370];
            this.inputMovableNumbers(1);
        });  
    },
    
    resetLevel:function(nivel){
        
        console.log("***resetLevel***");
        
        this.createDelayTime(500, function() {
             this.add.tween(this.groupLevel[nivel]).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 500);
             
             if(this.groupLevel[nivel] != null) {
                this.groupLevel[nivel].removeAll(true);
             }
        }); 
        this.nivel =0;
        this.initVars();
    },
    
    
    rightAnswer: function() { 
        console.log("rightAnswer - 10 ");
        this.qtdErros = 0;
        //this.corrects++;
        //this.sound.play("hitAcerto");
        //this.showCallToAction = true;
        this.addPoints();
        var nivel=this.currentLevel;
        this.resetLevel(nivel);
        this.createDelayTime(500, this.gotoNextLevel ); // para o próximo nível   
    },

    wrongAnswer: function() { 
        console.log("wrongAnswer - 11 ");
        var nivel=this.currentLevel;
        this.nivelAnterior = this.currentLevel;
        
        
        if((this.currentLevel== 2) && (this.subNivel==2) )
        {
            this.currentLevel=2;
            this.subNivel=1;
        }
        else{
            if(this.currentLevel > 1) 
            {
                this.currentLevel--;
            }
        }
        
        if(this.lives>0){
             this.lives--;
            this.errors--;
        }
    
        switch(this.lives) {
            case 1: // mostra dica 1
                this.resetLevel(nivel);
                this.hideLevel(function() {
                    this.sound.play("soundDica").onStop.add(this.onCompleteShowDica, this);
                });
            break;
            case 0: // toca som de resumo
                this.resetLevel(nivel);
                this.lives = 0;
                this.hideLevel();
                this.showResumo();
            break;
            default: // game over
            break;
        }
        this.updateLivesText();
        
    },

    onCompleteShowDica: function() {
        if(this.HAS_CALL_TO_ACTION) {
            this.showCallToAction = true;
            this.showNextLevel();
        } else {
            this.add.tween(this.placar).to({y: -120}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.showNextLevel, this);
        }
    },

    /* -FINAL-   FUNCOES CUSTOMIZAVEIS DO JOGO ATUAL */
    /*********************************************************************************************************************/        

    

    update: function () {



    }
};
