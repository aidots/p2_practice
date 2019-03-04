
class Main extends eui.UILayer {

    private world: p2.World
    private planeBody_ground: p2.Body
    private planeBody_left: p2.Body
    private planeBody_right: p2.Body
    private planeBody_top: p2.Body
    private shapeBody: p2.Body
    private display: egret.DisplayObject
    private display1: egret.DisplayObject

    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let img: egret.Bitmap = new egret.Bitmap()
        img = this.createBitmapByName("bg_jpg")
        img.width = this.stage.stageWidth
        img.height = this.stage.stageHeight
        this.addChild(img)
        this.CreateWorld()
        this.CreatePlanes()
        this.CreateBall()
        

        this.addEventListener(egret.Event.ENTER_FRAME, this.update, this)
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this)
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private CreateWorld() {
        this.world = new p2.World()
        // this.world.sleepMode = p2.World.BODY_SLEEPING
        this.world.sleepMode = p2.World.NO_SLEEPING

        // this.world.gravity = [0, 1]
        this.world.gravity = [0, 1]
    }

    private CreatePlanes() {
        //注意，角度是按逆时针来算的。原始方向是正y方向。
        //Ground Plane
        let planeShape_ground: p2.Plane = new p2.Plane()
        this.planeBody_ground = new p2.Body({
            type: p2.Body.KINEMATIC,
            position: [0, this.stage.stageHeight]
        })
        this.planeBody_ground.angle = Math.PI //正y到负y，180度
        this.planeBody_ground.displays = []
        this.planeBody_ground.addShape(planeShape_ground)
        this.world.addBody(this.planeBody_ground)

        //Left Plane
        let planeShape_left: p2.Plane = new p2.Plane()
        this.planeBody_left = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, 0]
        })
        this.planeBody_left.angle = - Math.PI / 2 // 从正y到正x旋转，所以是负90度
        this.planeBody_left.displays = []
        this.planeBody_left.addShape(planeShape_left)
        this.world.addBody(this.planeBody_left)

        //Right Plane
        let planeShape_right: p2.Plane = new p2.Plane()
        this.planeBody_right = new p2.Body({
            type: p2.Body.STATIC,
            position: [this.stage.stageWidth, 0]
        })
        this.planeBody_right.angle = Math.PI / 2 //正y到负x，正90度
        this.planeBody_right.displays = []
        this.planeBody_right.addShape(planeShape_right)
        this.world.addBody(this.planeBody_right)

        //TOP Plane
        let planeShape_top: p2.Plane = new p2.Plane()
        this.planeBody_top = new p2.Body({
            type: p2.Body.STATIC,
            position: [0, 0]
        })
        this.planeBody_top.angle = 0 //正y不变，0度
        this.planeBody_top.displays = []
        this.planeBody_top.addShape(planeShape_top)
        this.world.addBody(this.planeBody_top)
    }

    /**
     * 想弄一个小球，无阻力的在四周碰撞。目前还没有搞定，总是有阻力。
     */
    private CreateBall() {
        let circleShape: p2.Shape = new p2.Circle({ radius: 60 })
        this.shapeBody = new p2.Body({ 
            mass: 1, 
            position: [100, 100],
            angle: -Math.PI/4,
            velocity: [0, 0]
        })

        this.shapeBody.addShape(circleShape)
        this.world.addBody(this.shapeBody)
        this.display = this.createBitmapByName("circle_png")
        this.display.width = (<p2.Circle>circleShape).radius * 2
        this.display.height = (<p2.Circle>circleShape).radius * 2

        this.display.anchorOffsetX = this.display.width / 2
        this.display.anchorOffsetY = this.display.height / 2
        this.display.x = -100
        this.display.y = -100
        this.display.rotation = 270
        this.shapeBody.displays = [this.display]
        this.shapeBody.damping = 0

        this.addChild(this.display)
    }

    private onButtonClick(e: egret.TouchEvent) {
        if (Math.random() > 0.5) {
            let boxShape: p2.Shape = new p2.Box({ width: 140, height: 80 })
            this.shapeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY], angularVelocity: 1 })
            this.shapeBody.addShape(boxShape)
            this.world.addBody(this.shapeBody)
            this.display = this.createBitmapByName("rect_png")
            this.display.width = (<p2.Box>boxShape).width
            this.display.height = (<p2.Box>boxShape).height
        }
        else {
            let circleShape: p2.Shape = new p2.Circle({ radius: 60 })
            this.shapeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY] })
            this.shapeBody.addShape(circleShape)
            this.world.addBody(this.shapeBody)
            this.display = this.createBitmapByName("circle_png")
            this.display.width = (<p2.Circle>circleShape).radius * 2
            this.display.height = (<p2.Circle>circleShape).radius * 2
        }

        this.display.anchorOffsetX = this.display.width / 2
        this.display.anchorOffsetY = this.display.height / 2
        
        //display放在左上角屏幕外
        this.display.x = -100
        this.display.y = -100

        this.display.rotation = 270
        this.shapeBody.displays = [this.display]
        this.addChild(this.display)
    }

    private update() {
        this.world.step(2.5)
        let l = this.world.bodies.length
        for (let i: number = 0; i < l; i++) {
            let boxBody: p2.Body = this.world.bodies[i]
            let box: egret.DisplayObject = boxBody.displays[0]
            if (box) {
                box.x = boxBody.position[0]
                box.y = boxBody.position[1]
                box.rotation = boxBody.angle * 180 / Math.PI
                if (boxBody.sleepState == p2.Body.SLEEPING) {
                    box.alpha = 0.5
                } else {
                    box.alpha = 1
                }
            }
        }
    }
}
