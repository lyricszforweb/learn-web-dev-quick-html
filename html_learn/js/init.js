import {optionsArray} from "./options.js"
import { lessons } from "./lessons.js";
import { lessonGenerator } from "./../../js/functions_exp.js";

let h = document.createElement("iframe");

showAd()

let currentLesson = window.localStorage.getItem("learnWebDevQuickLessonsDone")

const currentDateObj = new Date()

let streakIndex = Number(window.localStorage.getItem("learnWebDevQuickStreakIndex"))

streakIndex == null || streakIndex == ""? (streakIndex = 0): null;

const dateNow = Number(String(currentDateObj.getFullYear()) + (calculatePrevMonthsDate(currentDateObj.getMonth()) + Number(currentDateObj.getDate())));

let lastDate = Number(window.localStorage.getItem("learnWebDevQuickLastDate"));

streakIndex += Number(String(dateNow).slice(0, 4)) - Number(String(lastDate).slice(0, 4))

console.log(streakIndex);


const streak = window.localStorage.getItem("learnWebDevQuickStreakCount");

if (streak == null || streak == undefined || streak == ""){
    streak = 0
}

if (currentLesson == null || currentLesson == "") {
    window.localStorage.setItem("learnWebDevQuickLessonsDone", 0)
    currentLesson = window.localStorage.getItem("learnWebDevQuickLessonsDone")
}

window.onload = () => {
    setTimeout(() => {
        progress.style.display = "none";
        const canvas = document.getElementById("boardCanvas");
        const ctx = canvas.getContext("2d");
        const engine = new Engine(canvas, ctx, {width: 1920, height: 1080, aspect: {x: (1920 / window.innerWidth) * 0.5, y: 9, aspect: ((1920 - window.innerWidth) / 16) / ((1080 - window.innerHeight) / 9)}}, lessonGenerator(lessons), optionsArray, 10, currentLesson, lastDate, dateNow, streak, showAd);
    }, 2000);
}

async function startFullscreen() {
    const elem = document.documentElement; // Targets the whole page
    try {
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        }
    } catch (err) {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    }
}

async function lockOrientation() {
  try {
    // You must be in fullscreen first
    await screen.orientation.lock('landscape');
    console.log("Orientation locked to landscape");
  } catch (error) {
    console.error("Orientation lock failed: ", error);
  }
}

startBtn.onclick = () => {
    startBtn.style.display = "none";

    // startFullscreen();
    // lockOrientation();

}

function createAd() {
    fullScreenAd.style.display = "none"
    fullScreenAd.removeChild(h);
}

function showAd() {
    const adF = [
        "ad_fullscreen.html",
        "ad_video.html"
    ]

    let time = 0
    const selectedLink = adF[Math.floor(Math.random() * adF.length)]

    h.src = selectedLink;
    
    if (selectedLink == adF[1]){
        time = 30000;    
    } else if (selectedLink == adF[0]){
        time = 15000;
    }

    fullScreenAd.style.zIndex = -10;

    fullScreenAd.style.display = "block"
    fullScreenAd.appendChild(h);
    h.hidden = false;
    fullScreenAd.style.zIndex = 105;

    window.setTimeout(() => {
        createAd()
    }, time)
}