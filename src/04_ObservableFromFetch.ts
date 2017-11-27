import '../rxjs-extensions';

import { Observable } from "rxjs/Observable";

let button1 = document.getElementById("button1");
let button2 = document.getElementById("button2");
let output1 = document.getElementById("div01");
let output2 = document.getElementById("div02");

let click1 = Observable.fromEvent(button1, "click");
let click2 = Observable.fromEvent(button2, "click");

function loadWithFetch(url: string) {
    //return Observable.fromPromise(fetch(url).then(r => r.json()));

    /*
        If we just have the above line even if someone calls "loadWithFetch(movies.json)" and doesn't subscribe to it it will still bring movies.
        [ movies.json still in network tab ]
        In order to stop that and make the call lazy we do as below. 
    */
    return Observable.defer(()=>{
        return Observable.fromPromise(
            fetch(url).then(r => r.json())
        ).retryWhen(retryStrategy({ attempts: 3, delay: 1500 }));
    });    
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

function renderMovies(movies, output) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    });
}

function renderMoviesOutput1(movies) {
    renderMovies(movies, output1);
}

function renderMoviesOutput2(movies) {
    renderMovies(movies, output2);
}

click1.subscribe(
    e => (loadWithFetch("movies.json").subscribe(
        renderMoviesOutput1,
        e => console.log(`error: ${e}`),
        () => console.log("complete"))),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);
// Since Load with Observable returns an observable we need to subscribe twice. In a situation like this we can use flat map.

click2.flatMap(e => loadWithFetch("movies.json"))
    .subscribe(
    renderMoviesOutput2,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
    );