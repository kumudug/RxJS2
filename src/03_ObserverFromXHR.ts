import '../rxjs-extensions';

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

let button1 = document.getElementById("button1");
let output1 = document.getElementById("div01");
let button2 = document.getElementById("button2");
let output2 = document.getElementById("div02");
let button3 = document.getElementById("button3");
let output3 = document.getElementById("div03");

let click1 = Observable.fromEvent(button1, "click");
let click2 = Observable.fromEvent(button2, "click");
let click3 = Observable.fromEvent(button3, "click");

function load(url: string) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
        let movies = JSON.parse(xhr.responseText);
        movies.forEach(m => {
            let div = document.createElement("div");
            div.innerText = m.title;
            output1.appendChild(div);
        });
    });

    xhr.open("GET", url);
    xhr.send();
}

click1.subscribe(
    e => load("movies.json"),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);

load("movies.json");

function loadWithObserveble(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if (xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                //We can complete the observer cause we aren't expecting to receive any more data
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open("GET", url);
        xhr.send();
        //Retrying when the call fails
        //}).retry(3);
    }).retryWhen(retryStrategy({ attempts: 3, delay: 1500 }));
}

function retryStrategy({ attempts = 4, delay = 1000 }) {
    //This gets the error being passed from the observable. In this instance it's the "xhr.statusText"
    return function (errors) {
        return errors.
            scan((acc, value) => {
                console.log(acc, value);
                return acc + 1;
            }, 0)//0 is the starting number of accuminator (acc)
            .takeWhile(acc => acc < attempts) //Retry until accumilator is less than attempts.
            .delay(delay); //delay each call by 1 second
    }
}

//loadWithObserveble("movies.json"); //This will do nothing. Cause an observable doesn't do any calls until it's subscribed. This is one advantage of using observables

function renderMovies(movies, output) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

function renderMoviesOutput2(movies) {
    renderMovies(movies, output2);
}

function renderMoviesOutput3(movies) {
    renderMovies(movies, output3);
}

click2.subscribe(
    e => (loadWithObserveble("movies.json").subscribe(
        renderMoviesOutput2,
        e => console.log(`error: ${e}`),
        () => console.log("complete"))),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
// Since Load with Observable returns an observable we need to subscribe twice. In a situation like this we can use flat map.

click3.flatMap(e => loadWithObserveble("movies.json"))
    .subscribe(
    renderMoviesOutput3,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );