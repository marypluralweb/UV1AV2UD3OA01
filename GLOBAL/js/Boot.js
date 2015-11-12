/**
* @version    1.0.0
**/

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {
        this.stage.backgroundColor = "#FFFFFF";
        this.load.atlas('preloader', 'GLOBAL/images/preloader.png', 'GLOBAL/images/preloader.json');
    },


    create: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.setMinMax( 250, 150, 1000, 600);

        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.scale.refresh();


        BasicGame.isOnline = BasicGame.OfflineAPI.isOnlineMode();
        BasicGame.OnlineAPI.initialize(BasicGame.isOnline);
        


        BasicGame.InitialLevel = 1;
        this.game.time.events.add(400, this.initPreloader, this);
        
    },
    initPreloader: function() {


        this.game.canvas.className = "visible";
        this.state.start('Preloader');
        
    }
};