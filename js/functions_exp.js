export function lessonGenerator(lessons){
    const lesson_obj = {}
    lessons.forEach((lesson, index) => {
        lesson_obj[index] = lesson;
    })
    return lesson_obj;
}

export function generateRandomNumber(min, max) {
    return Math.floor((Math.random() * (max - min)) + min)
}