(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define('module', ['exports', 'kotlin', 'kotlinx-html-js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('kotlin'), require('kotlinx-html-js'));
  else {
    if (typeof kotlin === 'undefined') {
      throw new Error("Error loading module 'module'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'module'.");
    }
    if (typeof this['kotlinx-html-js'] === 'undefined') {
      throw new Error("Error loading module 'module'. Its dependency 'kotlinx-html-js' was not found. Please, check whether 'kotlinx-html-js' is loaded prior to 'module'.");
    }
    root.module = factory(typeof module === 'undefined' ? {} : module, kotlin, this['kotlinx-html-js']);
  }
}(this, function (_, Kotlin, $module$kotlinx_html_js) {
  'use strict';
  var IntRange = Kotlin.kotlin.ranges.IntRange;
  var get_create = $module$kotlinx_html_js.kotlinx.html.dom.get_create_4wc2mh$;
  var div = $module$kotlinx_html_js.kotlinx.html.js.div_wkomt5$;
  var h1 = $module$kotlinx_html_js.kotlinx.html.js.h1_1esf85$;
  var span = $module$kotlinx_html_js.kotlinx.html.js.span_x24v7w$;
  var h2 = $module$kotlinx_html_js.kotlinx.html.js.h2_nirn70$;
  var set_style = $module$kotlinx_html_js.kotlinx.html.set_style_ueiko3$;
  var append = $module$kotlinx_html_js.kotlinx.html.dom.append_k9bwru$;
  var Error_0 = Kotlin.kotlin.Error;
  var last = Kotlin.kotlin.collections.last_2p1efm$;
  var downTo = Kotlin.kotlin.ranges.downTo_dqglrj$;
  var ArrayList_init = Kotlin.kotlin.collections.ArrayList_init_mqih57$;
  Snake$Velocity$Up.prototype = Object.create(Snake$Velocity.prototype);
  Snake$Velocity$Up.prototype.constructor = Snake$Velocity$Up;
  Snake$Velocity$Down.prototype = Object.create(Snake$Velocity.prototype);
  Snake$Velocity$Down.prototype.constructor = Snake$Velocity$Down;
  Snake$Velocity$Left.prototype = Object.create(Snake$Velocity.prototype);
  Snake$Velocity$Left.prototype.constructor = Snake$Velocity$Left;
  Snake$Velocity$Right.prototype = Object.create(Snake$Velocity.prototype);
  Snake$Velocity$Right.prototype.constructor = Snake$Velocity$Right;
  function Food(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.placeFood();
  }
  Food.prototype.placeFood = function () {
    this.x = Math.floor(Math.random() * this.game.width);
    this.y = Math.floor(Math.random() * this.game.height);
  };
  Food.prototype.update = function () {
    this.game.grid.fillCell_vux9f0$(this.x, this.y);
    return true;
  };
  Food.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Food',
    interfaces: [Component]
  };
  function Game(width, height, size, fps, scoreNode, gridNode) {
    this.width = width;
    this.height = height;
    this.size = size;
    this.fps = fps;
    this.scoreNode = scoreNode;
    this.gridNode = gridNode;
    this.intervalId = null;
    this.scoreVal = 0;
    this.grid = new Grid(this);
    this.food = new Food(this);
    this.snake = new Snake(this, 5, 2, 3);
  }
  Game.prototype.update_0 = function () {
    var tmp$;
    this.displayScore_0();
    if (this.food.update() && this.snake.update()) {
      if (this.food.x === this.snake.x && this.food.y === this.snake.y) {
        this.food.placeFood();
        this.snake.addPart();
        this.scoreVal = this.scoreVal + 1 | 0;
        this.displayScore_0();
      }
      tmp$ = this.grid.update();
    }
     else
      tmp$ = false;
    return tmp$;
  };
  Game.prototype.displayScore_0 = function () {
    this.scoreNode.innerText = this.scoreVal.toString();
  };
  function Game$start$lambda(this$Game) {
    return function () {
      if (!this$Game.update_0())
        this$Game.stop();
    };
  }
  Game.prototype.start = function () {
    this.intervalId = window.setInterval(Game$start$lambda(this), 1000 / this.fps | 0);
  };
  Game.prototype.stop = function () {
    var tmp$, tmp$_0;
    if (this.intervalId != null) {
      tmp$_0 = (tmp$ = this.intervalId) != null ? tmp$ : Kotlin.throwNPE();
      window.clearInterval(tmp$_0);
    }
  };
  Game.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Game',
    interfaces: []
  };
  function Grid(game) {
    this.game = game;
    this.grid = null;
    this.grid = this.buildGrid_0();
  }
  function Grid$Cell(node, filled) {
    this.node = node;
    this.filled = filled;
  }
  Grid$Cell.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Cell',
    interfaces: []
  };
  Grid$Cell.prototype.component1 = function () {
    return this.node;
  };
  Grid$Cell.prototype.component2 = function () {
    return this.filled;
  };
  Grid$Cell.prototype.copy_6if5g$ = function (node, filled) {
    return new Grid$Cell(node === void 0 ? this.node : node, filled === void 0 ? this.filled : filled);
  };
  Grid$Cell.prototype.toString = function () {
    return 'Cell(node=' + Kotlin.toString(this.node) + (', filled=' + Kotlin.toString(this.filled)) + ')';
  };
  Grid$Cell.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.node) | 0;
    result = result * 31 + Kotlin.hashCode(this.filled) | 0;
    return result;
  };
  Grid$Cell.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.node, other.node) && Kotlin.equals(this.filled, other.filled)))));
  };
  Grid.prototype.buildGrid_0 = function () {
    var $receiver = new IntRange(0, this.game.width);
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$;
    tmp$ = $receiver.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      var tmp$_0 = destination.add_11rb$;
      var $receiver_0 = new IntRange(0, this.game.height);
      var destination_0 = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver_0, 10));
      var tmp$_1;
      tmp$_1 = $receiver_0.iterator();
      while (tmp$_1.hasNext()) {
        var item_0 = tmp$_1.next();
        var tmp$_2 = destination_0.add_11rb$;
        var cell = div(get_create(document));
        var $receiver_1 = cell.style;
        $receiver_1.position = 'absolute';
        $receiver_1.width = this.game.size.toString() + 'px';
        $receiver_1.height = this.game.size.toString() + 'px';
        $receiver_1.left = Kotlin.imul(item, this.game.size).toString() + 'px';
        $receiver_1.top = Kotlin.imul(item_0, this.game.size).toString() + 'px';
        $receiver_1.border = '1px solid #777';
        this.game.gridNode.appendChild(cell);
        tmp$_2.call(destination_0, new Grid$Cell(cell, false));
      }
      tmp$_0.call(destination, destination_0);
    }
    return destination;
  };
  Grid.prototype.fillCell_vux9f0$ = function (x, y) {
    if (0 <= x && x <= this.game.width) {
      if (0 <= y && y <= this.game.height) {
        this.grid.get_za3lpa$(x).get_za3lpa$(y).filled = true;
      }
    }
  };
  Grid.prototype.update = function () {
    var tmp$;
    tmp$ = (new IntRange(0, this.game.width)).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      var tmp$_0;
      tmp$_0 = (new IntRange(0, this.game.height)).iterator();
      while (tmp$_0.hasNext()) {
        var element_0 = tmp$_0.next();
        var cell = this.grid.get_za3lpa$(element).get_za3lpa$(element_0);
        cell.node.style.backgroundColor = cell.filled ? 'black' : 'white';
        cell.filled = false;
      }
    }
    return true;
  };
  Grid.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Grid',
    interfaces: [Component]
  };
  function Component() {
  }
  Component.$metadata$ = {
    kind: Kotlin.Kind.INTERFACE,
    simpleName: 'Component',
    interfaces: []
  };
  function main$lambda$lambda($receiver) {
    $receiver.unaryPlus_pdl1vz$('\uD83D\uDC0D Snake');
  }
  function main$lambda$lambda_0(this$, closure$score) {
    return function ($receiver) {
      $receiver.unaryPlus_pdl1vz$('Score: ');
      closure$score.v = span(this$);
    };
  }
  function main$lambda$lambda_1($receiver) {
    set_style($receiver, 'position: relative');
  }
  function main$lambda(closure$score, closure$grid) {
    return function ($receiver) {
      h1($receiver, void 0, main$lambda$lambda);
      h2($receiver, void 0, main$lambda$lambda_0($receiver, closure$score));
      closure$grid.v = div($receiver, void 0, main$lambda$lambda_1);
    };
  }
  function main(args) {
    var tmp$, tmp$_0, tmp$_1;
    var score = {v: null};
    var grid = {v: null};
    (tmp$ = document.body) != null ? append(tmp$, main$lambda(score, grid)) : null;
    if (score.v == null || grid.v == null)
      throw new Error_0('Cannot create game if the elements are not initialized');
    var game = new Game(25, 25, 25, 15, Kotlin.isType(tmp$_0 = score.v, HTMLElement) ? tmp$_0 : Kotlin.throwCCE(), Kotlin.isType(tmp$_1 = grid.v, HTMLElement) ? tmp$_1 : Kotlin.throwCCE());
    game.start();
  }
  function Snake(game, x, y, length) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.length = length;
    var $receiver = new IntRange(0, this.length);
    var destination = Kotlin.kotlin.collections.ArrayList_init_ww73n8$(Kotlin.kotlin.collections.collectionSizeOrDefault_ba2ldo$($receiver, 10));
    var tmp$;
    tmp$ = $receiver.iterator();
    while (tmp$.hasNext()) {
      var item = tmp$.next();
      destination.add_11rb$(new Snake$Point(this.x, this.y));
    }
    this.parts_0 = ArrayList_init(destination);
    this.velocity_0 = Snake$Velocity$Right_getInstance();
    document.addEventListener('keydown', Kotlin.getCallableRef('changeDirection', function ($receiver_0, event) {
      return $receiver_0.changeDirection_0(event);
    }.bind(null, this)));
  }
  function Snake$Point(x, y) {
    this.x = x;
    this.y = y;
  }
  Snake$Point.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Point',
    interfaces: []
  };
  Snake$Point.prototype.component1 = function () {
    return this.x;
  };
  Snake$Point.prototype.component2 = function () {
    return this.y;
  };
  Snake$Point.prototype.copy_vux9f0$ = function (x, y) {
    return new Snake$Point(x === void 0 ? this.x : x, y === void 0 ? this.y : y);
  };
  Snake$Point.prototype.toString = function () {
    return 'Point(x=' + Kotlin.toString(this.x) + (', y=' + Kotlin.toString(this.y)) + ')';
  };
  Snake$Point.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.x) | 0;
    result = result * 31 + Kotlin.hashCode(this.y) | 0;
    return result;
  };
  Snake$Point.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.x, other.x) && Kotlin.equals(this.y, other.y)))));
  };
  function Snake$Velocity(x, y) {
    this.x = x;
    this.y = y;
  }
  function Snake$Velocity$Up() {
    Snake$Velocity$Up_instance = this;
    Snake$Velocity.call(this, 0, 1);
  }
  Snake$Velocity$Up.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'Up',
    interfaces: [Snake$Velocity]
  };
  var Snake$Velocity$Up_instance = null;
  function Snake$Velocity$Up_getInstance() {
    if (Snake$Velocity$Up_instance === null) {
      new Snake$Velocity$Up();
    }
    return Snake$Velocity$Up_instance;
  }
  function Snake$Velocity$Down() {
    Snake$Velocity$Down_instance = this;
    Snake$Velocity.call(this, 0, -1);
  }
  Snake$Velocity$Down.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'Down',
    interfaces: [Snake$Velocity]
  };
  var Snake$Velocity$Down_instance = null;
  function Snake$Velocity$Down_getInstance() {
    if (Snake$Velocity$Down_instance === null) {
      new Snake$Velocity$Down();
    }
    return Snake$Velocity$Down_instance;
  }
  function Snake$Velocity$Left() {
    Snake$Velocity$Left_instance = this;
    Snake$Velocity.call(this, -1, 0);
  }
  Snake$Velocity$Left.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'Left',
    interfaces: [Snake$Velocity]
  };
  var Snake$Velocity$Left_instance = null;
  function Snake$Velocity$Left_getInstance() {
    if (Snake$Velocity$Left_instance === null) {
      new Snake$Velocity$Left();
    }
    return Snake$Velocity$Left_instance;
  }
  function Snake$Velocity$Right() {
    Snake$Velocity$Right_instance = this;
    Snake$Velocity.call(this, 1, 0);
  }
  Snake$Velocity$Right.$metadata$ = {
    kind: Kotlin.Kind.OBJECT,
    simpleName: 'Right',
    interfaces: [Snake$Velocity]
  };
  var Snake$Velocity$Right_instance = null;
  function Snake$Velocity$Right_getInstance() {
    if (Snake$Velocity$Right_instance === null) {
      new Snake$Velocity$Right();
    }
    return Snake$Velocity$Right_instance;
  }
  Snake$Velocity.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Velocity',
    interfaces: []
  };
  Snake.prototype.addPart = function () {
    var lastPart = last(this.parts_0);
    this.parts_0.add_11rb$(new Snake$Point(lastPart.x, lastPart.y));
  };
  Snake.prototype.changeDirection_0 = function (event) {
    var tmp$;
    Kotlin.isType(tmp$ = event, KeyboardEvent) ? tmp$ : Kotlin.throwCCE();
    var direction = event.which;
    var LEFT = 37;
    var DOWN = 38;
    var RIGHT = 39;
    var UP = 40;
    var canGoRightOrLeft = this.velocity_0.y !== 0;
    var canGoUpOrDown = this.velocity_0.x !== 0;
    this.velocity_0 = direction === LEFT && canGoRightOrLeft ? Snake$Velocity$Left_getInstance() : direction === RIGHT && canGoRightOrLeft ? Snake$Velocity$Right_getInstance() : direction === UP && canGoUpOrDown ? Snake$Velocity$Up_getInstance() : direction === DOWN && canGoUpOrDown ? Snake$Velocity$Down_getInstance() : this.velocity_0;
  };
  Snake.prototype.collidesWithSide_0 = function () {
    return this.x < 0 || this.y < 0 || this.x > this.game.width || this.y > this.game.height;
  };
  Snake.prototype.collidesWithPart_0 = function (part) {
    return this.x === part.x && this.y === part.y;
  };
  Snake.prototype.update = function () {
    this.x = this.x + this.velocity_0.x | 0;
    this.y = this.y + this.velocity_0.y | 0;
    if (this.collidesWithSide_0())
      return false;
    var tmp$;
    tmp$ = downTo(this.parts_0.size - 1 | 0, 0).iterator();
    while (tmp$.hasNext()) {
      var element = tmp$.next();
      var part = this.parts_0.get_za3lpa$(element);
      if (element !== 0) {
        part.x = this.parts_0.get_za3lpa$(element - 1 | 0).x;
        part.y = this.parts_0.get_za3lpa$(element - 1 | 0).y;
        if (this.collidesWithPart_0(part))
          return false;
      }
       else {
        part.x = this.x;
        part.y = this.y;
      }
      this.game.grid.fillCell_vux9f0$(part.x, part.y);
    }
    return true;
  };
  Snake.$metadata$ = {
    kind: Kotlin.Kind.CLASS,
    simpleName: 'Snake',
    interfaces: [Component]
  };
  var package$co = _.co || (_.co = {});
  var package$kenrg = package$co.kenrg || (package$co.kenrg = {});
  var package$example = package$kenrg.example || (package$kenrg.example = {});
  package$example.Food = Food;
  package$example.Game = Game;
  Grid.Cell = Grid$Cell;
  package$example.Grid = Grid;
  var package$iface = package$example.iface || (package$example.iface = {});
  package$iface.Component = Component;
  package$example.main_kand9s$ = main;
  Snake.Point = Snake$Point;
  Object.defineProperty(Snake$Velocity, 'Up', {
    get: Snake$Velocity$Up_getInstance
  });
  Object.defineProperty(Snake$Velocity, 'Down', {
    get: Snake$Velocity$Down_getInstance
  });
  Object.defineProperty(Snake$Velocity, 'Left', {
    get: Snake$Velocity$Left_getInstance
  });
  Object.defineProperty(Snake$Velocity, 'Right', {
    get: Snake$Velocity$Right_getInstance
  });
  Snake.Velocity = Snake$Velocity;
  package$example.Snake = Snake;
  Kotlin.defineModule('module', _);
  main([]);
  return _;
}));

//@ sourceMappingURL=module.js.map
