class Engine {
    constructor(canvas, context, box_info = {width: 320, height: 240, aspect: 16/9}, lessons, options, max_prevtime, start_index, lastDate, currentDate, streak, showAd){
        this.streak = streak;
        this.mouseup = true;
        this.showAd = showAd;
        this.lessonsDone = Number(start_index);
        this.index = start_index || 0;
        this.canvas = canvas;
        this.context = context;
        this.width = box_info.width;
        this.height = box_info.height;
        this.aspect = box_info.aspect;
        this.lessons = lessons;
        this.options = options;
        this.max_prevtime = max_prevtime || "Not Defined"
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.moveFN = "";
        this.object = []
        this.mouse_obj = {
            endLoc: 0
        }
        this.buttons = [
            new Button(this.context, "NEXT", this.width - 220, 10, "next"),
            new Button(this.context, "HOME", this.width * 0.5 - 200 + 100, 10, "home"),
        ]
        
        this.showUI = true;

        this.UI = new ToggleUIVisibility(context, "!", 20, this.height * 0.5 - 120, "uiBtn")
        this.UI.draw()
        
        this.drawBoard()
        
        this.text()

        this.canvas.addEventListener("touchstart", (e) => {
            this.mouseStart(e)
        })
        this.canvas.addEventListener("touchend", (e) => {
            this.mouseEnd(e);
        })
        this.canvas.addEventListener("mousedown", (e) => {
            this.mouseStart(e)
        })
        this.canvas.addEventListener("mouseup", (e) => {
            this.mouseEnd(e);
        })

        this.object_to_move = "";
        this.object_to_move_index = 0
        this.not_won = false;
        this.color = "";
        this.prevBtnClicked = false;
        this.backPressed = false;
        this.lastDate = lastDate;
        this.currentDate = currentDate;
        this.lessonsDoneToday = 0;
    }

    populateObject() {
        const color = this.colorRandom(["black", "rgb(145, 81, 13)", "rgb(105, 5, 123)", "blue", "green", "rgb(128, 100, 100)"])

        this.options[this.index].forEach((option, index) => {
            this.object.push(new Option_Box(this.context, option.text, option.size, option.x, option.y, option.index, color))
        })

        this.object = this.object.sort((a, b) => a.y - b.y)

        this.wipeBoard()

        this.buttons = [
            new Button(this.context, "NEXT", this.width - 220, 10, "next"),
            new Button(this.context, "BACK", 20, 10, "back"),
            new Button(this.context, "HOME", this.width * 0.5 - 200 + 100, 10, "home"),
        ]

        if (this.lessonsDone <= this.index) {
            this.buttons = this.buttons.filter((button) => {return !(button.type == "next")})
        }

        if (this.showUI) {
            this.buttons.forEach(button => {
                button.draw()
            })
        }


        this.UI.draw()
    }

    drawBoard() {
        this.wipeBoard();
    }

    wipeBoard() {
        
        this.context.fillStyle = "rgba(43, 64, 94, 1)"
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = "blue";
        this.context.fillRect(0, 0, this.width * 0.4, this.height * 0.1)
        this.context.fillStyle = "rgba(2, 48, 94, 0.4)"
        for (let i = 0; i < this.height / 80; i++) {
            this.context.fillRect(0, i * 80 - 15, this.width, 4)
        }

        if (this.object.length>0) {
            //this.object = this.object.sort((a, b) => a.y - b.y)
            this.object.forEach(obj => obj.draw())
        }
    }

    text() {
        this.object = []

        this.wipeBoard()

        this.color = this.colorRandom()
        
        let lastIndex = 0

        this.context.fillStyle = this.color;
        this.context.font = "44pt Arial";

        this.lessons[this.index].forEach((el, index) => {

            this.context.fillText(el, this.width / 2, 200 + (index * 80))
            lastIndex = index;
        })

        this.nextButton = new NextButton(this.context, "NEXT", 100, this.width / 2, (lastIndex + 1) * 80 + 200 )
        this.nextButton.draw()

        this.buttons = [
            new Button(this.context, "PREV", 20, 10, "prev"),
            new Button(this.context, "NEXT", this.width - 220, 10, "next"),
            new Button(this.context, "HOME", this.width * 0.5 - 200 + 100, 10, "home"),
        ]

        if (this.lessonsDone <= this.index) {
            this.buttons = this.buttons.filter((button) => {return !(button.type == "next")})
        }

        if (this.showUI) {
            this.buttons.forEach(button => {
                button.draw()
            })
        }

        this.UI.draw()
    }

    colorRandom(colors){
        const colorBank = colors || ["black", "red", "white", "deeppink", "lime", "brown", "tomato", "papayawhip", "yellow"];
 
        return colorBank[Math.floor(colorBank.length * Math.random())]
    }

    mouseStart(e) {
        this.mouseup = false;
        
        this.not_won = false;

        this.temp_won = true
        
        this.moveFN = (e, f) => {
            this.mouseMove(e, f)
        }

        let x_pos = (e.x / window.innerWidth) * this.width;
        let y_pos = (e.y / window.innerHeight) * this.height;

        if (e.type == "touchstart") {
            x_pos = (e.touches[0].clientX / window.innerWidth) * this.width;
            y_pos = (e.touches[0].clientY / window.innerHeight) * this.height;
        }

        this.mouse_obj.endLoc = {
            x: x_pos - 5,
            y: y_pos - 5,
            width: 10,
            height: 10
        }

        if (this.nextButton == null && this.backPressed == false && this.object.length > 0){
            this.object.forEach((obj, index) => {
                if (boxCollision(obj, this.mouse_obj.endLoc)) {
                    this.object_to_move = obj;
                    this.object_to_move_index = index;
                }
            })
        }

        this.buttons.forEach((button) => {
            if (boxCollision(button, this.mouse_obj.endLoc)){
                if (button.type == "next"){
                    this.not_won = true
                    this.prevBtnClicked = null;
                } else if (button.type == "home"){
                    window.location = "./../"
                    this.prevBtnClicked = false
                } else if (button.type == "prev"){
                    this.prevBtnClicked = true
                    this.index > 0? (
                        this.index--,
                        this.wipeBoard(),
                        this.text()):null;
                } else if (button.type == "back"){
                    this.wipeBoard();
                    this.text();
                    this.prevBtnClicked = false
                    this.backPressed = true;
                    this.object = []
                    this.object_to_move = ''
                }
            }
        })

        if (boxCollision(this.UI, this.mouse_obj.endLoc)){
            this.showUI? this.hideUIFn() : this.showUIFn()
            this.UI.draw()
        }


        this.canvas.addEventListener("mousemove", this.moveFN.bind(e, this))
        this.canvas.addEventListener("touchmove", this.moveFN.bind(e, this))

    }

    mouseEnd(e) {

        if (this.backPressed) {
            this.backPressed = false;
            return
        }

        if (this.prevBtnClicked == null) {
            this.prevBtnClicked = false
            this.wipeBoard()
            this.index++;
            this.calculateStreak()
            this.object = []
            this.text()
        }
        this.mouseup = true;

        if (((this.object.length <= 0 || this.prevBtnClicked) && this.nextButton)) {
            if (boxCollision(this.nextButton, this.mouse_obj.endLoc)) {
                this.nextButton = null;
                this.wipeBoard()
                this.populateObject()
                return   
            } 
        } 

        if (this.nextButton != null) {
            return
        }

        let x_pos = (e.x / window.innerWidth) * this.width;
        let y_pos = (e.y / window.innerHeight) * this.height;



        this.mouse_obj.endLoc = {
            x: x_pos,
            y: y_pos,
            width: 10,
            height: 10
        }
        
        this.object_to_move != ""? this.object[this.object_to_move_index] = this.object_to_move : null;

        this.object = this.object.sort((a, b) => a.y - b.y)

        this.object.forEach((obj, index) =>{
            if (obj.index != index) this.not_won = true
        })

        this.object_to_move = ""

        if (!this.not_won) {
            this.prevBtnClicked = false
            this.wipeBoard()
            this.index++;
            this.calculateStreak()       
            this.object = []
            this.text()
            this.lessonsDoneToday++;
            if (this.lessonsDoneToday % 4 == 0) {
                this.showAd()
            }
        }
    }

    calculateStreak() {
        if (this.lessonsDone < this.index) {
            this.lessonsDone = this.index;
            window.localStorage.setItem("learnWebDevQuickLessonsDone", this.lessonsDone);
        }

        if (this.lastDate == null || this.lastDate == ""){
            this.streak++;
            this.lastDate = this.currentDate;
            window.localStorage.setItem("learnWebDevQuickLastDate",  this.currentDate)
        }

        if (this.lastDate + 1 == this.currentDate) {
            this.streak++;
            this.lastDate = this.currentDate;
            window.localStorage.setItem("learnWebDevQuickLastDate",  this.currentDate)
        } else if (this.lastDate == Number(String(new Date().getFullYear() - 1) + calculatePrevMonthsDate(12, new Date().getFullYear() - 1)) && new Date().getDate() + new Date().getMonth() == 1) {
            this.streak++;
            this.lastDate = this.currentDate;
            window.localStorage.setItem("learnWebDevQuickLastDate",  this.currentDate)
        } else if (this.lastDate < this.currentDate) {
            this.streak = 1;
            this.lastDate = this.currentDate;
            window.localStorage.setItem("learnWebDevQuickLastDate",  this.currentDate)
        }

        window.localStorage.setItem("learnWebDevQuickStreakCount", this.streak);
    }

    mouseMove(f, e) {
    
        if (this.mouseup) return

        if (this.object.length <= 0) return

        let x_pos = (e.x / window.innerWidth) * this.width;
        let y_pos = (e.y / window.innerHeight) * this.height;

        if (e.type == "touchmove") {
            x_pos = (e.touches[0].clientX / window.innerWidth) * this.width;
            y_pos = (e.touches[0].clientY / window.innerHeight) * this.height;
        }

        if (this.object_to_move != "" ) {
            this.object_to_move.x += x_pos - this.mouse_obj.endLoc.x 
            this.object_to_move.y += y_pos - this.mouse_obj.endLoc.y 
            this.object_to_move.draw()
        }

        this.mouse_obj.endLoc = {
            x: x_pos,
            y: y_pos
        }

        this.wipeBoard()
        
        //this.object = this.object.sort((a, b) => a.y - b.y)

        this.buttons.forEach(button => {
            this.showUI? button.draw() : null;
        })

        this.UI.draw()

        // f.context.fillStyle = "blue";
        // f.context.fillRect(x_pos, y_pos, 40, 40);
        // f.context.fillStyle = "black";
    }

    hideUIFn () {
        this.showUI = false

        this.wipeBoard()

        this.object.length > 0? (
            null) : (
                this.text()
            )
        this.buttonsCache = this.buttons;
        this.buttons = []
    }

    showUIFn () {
        this.showUI = true;
        this.wipeBoard()
        this.object.length > 0? 
            (null) : (
                this.text()
            )
        this.buttons = this.buttonsCache;
        this.buttons.forEach(button => {
            button.draw()
        })
    }
}


class Option_Box {
    constructor(context, text, size, x, y, index, color) {
        this.text = text;
        this.size = size;
        this.width = (this.size - 14) * this.text.length + 50; 
        this.height = this.size * 1.4;
        this.context = context;
        this.x = x;
        this.y = y;
        this.index = index;
        this.color = color;
    }

    draw() {
        this.context.fillStyle = this.color
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.fillStyle = "white";
        this.context.font = "40pt Helvetica"
        this.context.fillText(this.text, this.x + this.width / 2, this.y + (this.size * 1.4 / 2)) 
    }
}

class NextButton{
    constructor(context, text, size, x, y) {
        this.text = text;
        this.size = 80;
        this.width = this.size * this.text.length;
        this.height = this.size * 1.4;
        this.context = context;
        this.x = x - this.width / 2;
        this.y = y - this.size / 2;
    }
    draw() {
        this.context.fillStyle = "tan";
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.fillStyle = "blue"
        this.context.fillRect(this.x, this.y  + 15, this.width, this.height);
        this.context.fillStyle = "white"
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.size)
        this.context.fillStyle = "rgba(255, 255, 255, 0.3)"
        this.context.fillText(this.text, this.x + this.width / 2, this.y + this.size + 4)
    }
}

class Button{
    constructor(context=CanvasRenderingContext2D, text="", x=0, y=0, type="") {
        this.text = text;
        this.context = context;
        this.size = 50;
        this.width = this.size * this.text.length;
        this.height = this.size * 1.2;
        this.x = x;
        this.y = y;
        this.type = type;
    }
    draw() {
        this.context.font = "30pt Helvetica";
        this.context.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.context.fillRect(this.x, this.y + 30, this.width, this.height);
        this.context.fillStyle = "rgba(255, 255, 255, 0.2)";
        this.context.fillText(this.text, this.x + this.width * 0.5, this.y + 60);
        this.context.fillStyle = "indigo";
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.fillStyle = "wheat";
        this.context.fillRect(this.x + 4, this.y - 4, this.width, this.height);
        this.context.font = "40pt Helvetica";
        this.context.fillStyle = "rgba(0, 255, 0, 0.1)";
        this.context.fillRect(this.x, this.y, this.width, this.height);
        this.context.fillStyle = "rgb(23, 3, 3)";
        this.context.fillText(this.text, this.x + this.width * 0.5, this.y + this.size * 0.5);
    }
}

class ToggleUIVisibility extends Button {
    constructor(context, text, x, y, type){
        super(context, text, x, y, type);

    }

    draw() {
        this.context.fillStyle = "gray";
        this.context.fillRect(this.x, this.y, this.width, this.height)
        this.context.fillStyle = "gainsboro"
        this.context.fillText(this.text, this.x+this.width * 0.5, this.y + this.size * 0.5)
    }
}

function boxCollision(a, b) {
    return (
        a.x + a.width >= b.x && b.x + b.width >= a.x && 
        a.y + a.height >= b.y && b.y + b.height >= a.y 
    )
}

function calculatePrevMonthsDate(currentMonth, _year) {
    const index = currentMonth;

    const year = _year || new Date().getFullYear()

    let dateIndex = 0;

    for (let i = 0; i < index; i++) {
        dateIndex += new Date(year, i + 1, 0).getDate()
    }

    return dateIndex

}