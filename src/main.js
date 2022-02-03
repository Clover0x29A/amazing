import Phaser from './lib/phaser.js'
import Game from './scenes/game.js'

export default new Phaser.Game
({
    type: Phaser.AUTO,
    width: 680,
    height: 480,
    scene: Game,
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity:
            {
                y: 0
            },
            debug: true
        }
    }
})