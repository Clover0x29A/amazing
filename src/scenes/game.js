import Phaser from '../lib/phaser.js'

export default class Game extends Phaser.Scene {

    /** @type {Phaser.Physics.Arcade.Sprite} */
    mouse
    cheese

    constructor() {
        super('game')
    
        this.gridLayout = []
        this.tileWidth = 32
        this.tileHeight = 32
        //double grid size to allow passage way and walls
        // plus border need odd number to be to use a border
        // else it doesn't look right
        this.gridX = 19 * 2 + 2
        this.gridY = 16 * 2 + 2
        this.gridLayout = [[]]
        //centering the maze X and Y
        this.xOrigin = 32
        this.yOrigin = 32

    }

    preload() {
        this.load.image('tiles', 'assets/tilemap.png')
        this.load.image('mouse', 'assets/mouse.png')
        this.load.image('cheese', 'assets/cheese.png')
    }

    create() {
        //Adding typical W,A,S,D keys for movement
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        /**
         *  start of setting up the maze using a tilemap
         * from a 2D array
         */
        //can now use tile names instead of numbers
        this.setTileIds()
        //Not actkually a blank maze
        //it's a grid
        this.createBlankMaze()
        //time to take the grid and make a
        // maze
        this.createMazeTilemap()
        this.maze = this.make.tilemap(
            {
                data: this.gridLayout,
                tileWidth: this.tileWidth,
                tileHeight: this.tileHeight
            })
        this.tiles = this.maze.addTilesetImage('tiles')
        this.layer = this.maze.createLayer(0, this.tiles, 0, 0)
        /**
         *  END MAKING MAZE
         * 
         * create mouse and cheese sprites
         * then add them to the maze at
         * opposite ends
         */

        // time to add a mouse for the player
        this.mouse = this.physics.add.image(0, 0, 'mouse').setOrigin(0, 1)
        this.mouse.x = (this.gridX - 1) * this.tileWidth
        this.mouse.y = this.tileHeight * 2
        this.cheese = this.physics.add.image(0, 0, 'cheese').setOrigin(0, 1)
        this.cheese.x = this.tileWidth
        this.cheese.y = (this.gridY) * this.tileHeight

       this.physics.add.overlap(this.mouse, this.cheese, this.collectCheese, null, this)
       
        //Command camera to follow mouse!
        this.worldCamera = this.cameras.main
        this.worldCamera.startFollow(this.mouse)
        this.worldCamera.setBounds(0, 0, (this.gridX * this.tileWidth) + this.tileWidth, (this.gridY * this.tileHeight) + this.tileHeight)
        
    }

    update(t, dt) {
        //let's move the mouse!
        /**
         * So because I want to move a tile at a time
         * instead of just a few pixels at a time, and I am
         * also doing my own collision detection.  I am
         * going to convert my mouse origin to what would
         * be the tile location equivalant
         */
        let mouseX = this.mouse.x / this.tileWidth
        let mouseY = (this.mouse.y / this.tileHeight) - 1
        //Have we pressed a key?
       if(this.keyA.isDown)
        {
            if (this.gridLayout[mouseY][mouseX - 1] !== this.mazeBlock) {
                this.mouse.x -= this.tileWidth
           }
           //reset so we don't move to quick
           this.keyA.reset()
       }
        //rinse and repeat above
        else if (this.keyD.isDown) {
            if (this.gridLayout[mouseY][mouseX + 1] !== this.mazeBlock) {
                this.mouse.x += this.tileWidth
                this.keyD.reset()
            }
        }
        else if (this.keyW.isDown) {
            if (this.gridLayout[mouseY - 1][mouseX] !== this.mazeBlock) {
                this.mouse.y -= this.tileHeight
           }
           this.keyW.reset()
        }
        else if (this.keyS.isDown) {
            if (this.gridLayout[mouseY + 1][mouseX] !== this.mazeBlock) {
                this.mouse.y += this.tileHeight
           }
           this.keyS.reset()
        }
        
    }  

    createMazeTilemap() {
        let mazeRand
        /**
         * 
         * complete Next!
         * Now that there is a grid pattern to work with
         * I am starting at the first blank square and
         * either I am getting rid of the top square or
         * the right square.  Then I am stepping to the
         * next empty space to do it again
         * 
         */
        for (let y = 3; y < this.gridY; y += 2)
        {
            for (let x = 1; x < this.gridX - 2; x += 2)
            {
                mazeRand = Phaser.Math.Between(0, 1)
                if (mazeRand > 0.5)
                {
                    this.gridLayout[y - 1] [x] = this.mazeFill
                }
                else
                {
                    this.gridLayout[y][x +1] = this.mazeFill
                    }
                }
            }
   
    }
        

    setTileIds() {
        this.mazeFill = 1
        this.mazeBlock = 0
       
    }
        
    createBlankMaze() {
        // make an internal grid across not doing last row before border
          // make grid the number for blank square 1
          for (let i = 0; i <= this.gridY; i++) {
            this.gridLayout[i] = []
            for (let j = 0; j <= this.gridX; j++) {
                this.gridLayout[i][j] = 0
            }
        }
        
        for (let y = 3; y < this.gridY; y += 2) {
            for (let x = 1; x < this.gridX - 1; x += 2)
            {
                this.gridLayout[y][x] = 1
            }
            //this.gridLayout[y][this.gridX - 1] = 1
        }
        for (let x = 1; x < this.gridX - 1; x++)
            this.gridLayout[1][x] = this.mazeFill
        for (let y = 1; y < this.gridY ; y++)
            this.gridLayout[y][this.gridX -1] = this.mazeFill
    }

    collectCheese()
    {
        alert('Congrats on getting the cheese!')
        this.scene.restart()
    }
}