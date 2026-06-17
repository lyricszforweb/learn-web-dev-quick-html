const lastDate = window.localStorage.getItem("learnWebDevQuickLastDate")

let STREAK_COUNT = 0

const currentDateObj = new Date()

let streakIndex = window.localStorage.getItem("learnWebDevQuickStreakIndex")

streakIndex == null || streakIndex == ""? (streakIndex = 0): null;


if (lastDate == null || lastDate == ""){
    window.localStorage.setItem("learnWebDevQuickStreakCount", 0)
    STREAK_COUNT = 0
    window.localStorage.setItem("learnWebDevQuickStreakIndex", 0)
}  else {
    STREAK_COUNT = window.localStorage.getItem("learnWebDevQuickStreakCount")
}

const currentDateN = String(currentDateObj.getFullYear()) + (calculatePrevMonthsDate(currentDateObj.getMonth()) + Number(currentDateObj.getDate()))

let lastDateN = Number(window.localStorage.getItem("learnWebDevQuickLastDate"))


if (lastDate == Number(String(new Date().getFullYear() - 1) + calculatePrevMonthsDate(12, new Date().getFullYear() - 1)) && new Date().getDate() + new Date().getMonth() == 1) {
    
} else if (lastDateN < currentDateN - 1) {
    console.log(lastDate, currentDateN)
    STREAK_COUNT = 0;
}

if ((window.localStorage.getItem("learnWebDevQuickStreakIndex") != null || window.localStorage.getItem("learnWebDevQuickStreakIndex") != "") && new Date().getDate() + new Date().getMonth() == 1 && lastDateN == currentDateN) {

    window.localStorage.setItem("learnWebDevQuickStreakIndex", Number(window.localStorage.getItem("learnWebDevQuickStreakIndex")) + 1)

}


function card(label = "", description = "", anchor = "", target) {
    const anchorEl = document.createElement("a");
    anchorEl.href = anchor;
    const div = document.createElement("div");
    const p = document.createElement("p");
    const h3 = document.createElement("h3");
    const img = document.createElement("img");

    div.setAttribute("class", "card")

    p.textContent = description; 
    h3.textContent = label;


    anchorEl.appendChild(div);
    div.appendChild(h3);
    div.appendChild(img);
    div.appendChild(p);
    document.getElementById(target).appendChild(anchorEl); 
}

function renderCards() {
    const target = document.getElementById('target');
    target.innerHTML = '';
    const lang = document.getElementById('language').value.toLowerCase();
    const linkC = './' + lang + '_learn';

    card('Learn', 'Continue your learning path', linkC, 'target');
    card('Community', 'Join our vibrant community', 'https://t.me/+i4XY6BBWyoQwZWNk', 'target');
    card('Settings', 'Customize the app to suit your needs', '', 'target');
    card('About', 'About the app and the developers', '', 'target');
    card('Exit', 'Exit the app', '', 'target');
}

renderCards();

window.onload = () => {
    
    let loading_progress = 10;
    
    a = setInterval(() => {
        loading_progress += Math.abs(Math.sin(loading_progress) * (Math.floor(Math.random() * 5)) + 1)
        document.getElementById("loading_bar").value = loading_progress;
        
        if (loading_progress >= 120) {
            document.getElementById("body").setAttribute("style", "display: block");
            document.getElementById("loading").style.display = "none";
            clearInterval(a);

            const context = document.querySelector("#progress").getContext("2d");
            context.canvas.width = 300;
            context.canvas.height = 300;
            context.textAlign = "center";
            context.fillRect(0, 0, 300, 300);
            context.font = "40pt Monospace"
            context.fillStyle = "white";
            context.fillText("Streak: " + STREAK_COUNT, 300 * 0.5, 300 * 0.25)

            context.fillStyle = "gold";
            context.fillRect(20, 200, 300 - 40, 80)
            context.fillStyle = "wheat";
            context.fillRect(80, 120, 40, 40)
            context.fillRect(300 - 80 - 40, 120, 40, 40)
            context.fillStyle = "gray";
            context.fillRect(20, 260, 300 - 40, 30)

            context.fillStyle = "white";
            context.font = "14pt Helvetica"
            context.fillText("Your journey since " + (new Date().getFullYear() - streakIndex), 300 * 0.5, 280)
        }
        
    }, 50);

    document.getElementById("language").onchange = (e) => {
        document.getElementById("currentJourney").textContent = e.target.value.toUpperCase();
        target.innerHTML = ""

        renderCards()

        
    }
}


function calculatePrevMonthsDate(currentMonth) {
    const index = currentMonth;

    let dateIndex = 0;

    for (let i = 0; i < index; i++) {
        dateIndex += new Date(new Date().getFullYear(), i + 1, 0).getDate()
    }

    return dateIndex

}
