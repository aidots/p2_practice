var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    Main.prototype.createGameScene = function () {
        var img = new egret.Bitmap();
        img = this.createBitmapByName("bg_jpg");
        img.width = this.stage.stageWidth;
        img.height = this.stage.stageHeight;
        this.addChild(img);
        this.CreateWorld();
        this.CreatePlanes();
        this.CreateBall();
        this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this)
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    Main.prototype.CreateWorld = function () {
        this.world = new p2.World();
        // this.world.sleepMode = p2.World.BODY_SLEEPING
        this.world.sleepMode = p2.World.NO_SLEEPING;
        // this.world.gravity = [0, 1]
        this.world.gravity = [0, 0];
    };
    Main.prototype.CreatePlanes = function () {
        //注意，角度是按逆时针来算的。原始方向是正y方向。
        //Ground Plane
        var planeShape_ground = new p2.Plane();
        this.planeBody_ground = new p2.Body({
            // type: p2.Body.KINEMATIC,
            position: [0, this.stage.stageHeight]
        });
        this.planeBody_ground.angle = Math.PI; //正y到负y，180度
        this.planeBody_ground.displays = [];
        this.planeBody_ground.addShape(planeShape_ground);
        this.world.addBody(this.planeBody_ground);
        //Left Plane
        var planeShape_left = new p2.Plane();
        this.planeBody_left = new p2.Body({
            // type: p2.Body.KINEMATIC,
            position: [0, 0]
        });
        this.planeBody_left.angle = -Math.PI / 2; // 从正y到正x旋转，所以是负90度
        this.planeBody_left.displays = [];
        this.planeBody_left.addShape(planeShape_left);
        this.world.addBody(this.planeBody_left);
        //Right Plane
        var planeShape_right = new p2.Plane();
        this.planeBody_right = new p2.Body({
            // type: p2.Body.KINEMATIC,
            position: [this.stage.stageWidth, 0]
        });
        this.planeBody_right.angle = Math.PI / 2; //正y到负x，正90度
        this.planeBody_right.displays = [];
        this.planeBody_right.addShape(planeShape_right);
        this.world.addBody(this.planeBody_right);
        //TOP Plane
        var planeShape_top = new p2.Plane();
        this.planeBody_top = new p2.Body({
            // type: p2.Body.KINEMATIC,
            position: [0, 0]
        });
        this.planeBody_top.angle = 0; //正y不变，0度
        this.planeBody_top.displays = [];
        this.planeBody_top.addShape(planeShape_top);
        this.world.addBody(this.planeBody_top);
    };
    /**
     * 想弄一个小球，无阻力的在四周碰撞。目前还没有搞定，总是有阻力。
     */
    Main.prototype.CreateBall = function () {
        var circleShape = new p2.Circle({ radius: 60 });
        this.shapeBody = new p2.Body({
            mass: 1,
            position: [100, 100],
            angle: -Math.PI / 4,
            velocity: [50, 50]
        });
        this.shapeBody.addShape(circleShape);
        this.world.addBody(this.shapeBody);
        this.display = this.createBitmapByName("circle_png");
        this.display.width = circleShape.radius * 2;
        this.display.height = circleShape.radius * 2;
        this.display.anchorOffsetX = this.display.width / 2;
        this.display.anchorOffsetY = this.display.height / 2;
        this.display.x = -100;
        this.display.y = -100;
        this.display.rotation = 270;
        this.shapeBody.displays = [this.display];
        this.shapeBody.damping = 0;
        this.addChild(this.display);
    };
    Main.prototype.onButtonClick = function (e) {
        if (Math.random() > 0.5) {
            var boxShape = new p2.Box({ width: 140, height: 80 });
            this.shapeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY], angularVelocity: 1 });
            this.shapeBody.addShape(boxShape);
            this.world.addBody(this.shapeBody);
            this.display = this.createBitmapByName("rect_png");
            this.display.width = boxShape.width;
            this.display.height = boxShape.height;
        }
        else {
            var circleShape = new p2.Circle({ radius: 60 });
            this.shapeBody = new p2.Body({ mass: 1, position: [e.stageX, e.stageY] });
            this.shapeBody.addShape(circleShape);
            this.world.addBody(this.shapeBody);
            this.display = this.createBitmapByName("circle_png");
            this.display.width = circleShape.radius * 2;
            this.display.height = circleShape.radius * 2;
        }
        this.display.anchorOffsetX = this.display.width / 2;
        this.display.anchorOffsetY = this.display.height / 2;
        //display放在左上角屏幕外
        this.display.x = -100;
        this.display.y = -100;
        this.display.rotation = 270;
        this.shapeBody.displays = [this.display];
        this.addChild(this.display);
    };
    Main.prototype.update = function () {
        this.world.step(2.5);
        var l = this.world.bodies.length;
        for (var i = 0; i < l; i++) {
            var boxBody = this.world.bodies[i];
            var box = boxBody.displays[0];
            if (box) {
                box.x = boxBody.position[0];
                box.y = boxBody.position[1];
                box.rotation = boxBody.angle * 180 / Math.PI;
                if (boxBody.sleepState == p2.Body.SLEEPING) {
                    box.alpha = 0.5;
                }
                else {
                    box.alpha = 1;
                }
            }
        }
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map