import '../rxjs-extensions';

import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

class MyObserver implements Observer<number> {
    container: HTMLElement;
    constructor(elementId: string){
        this.container = document.getElementById(elementId);
    }

    
    next(value) {
        this.container.innerHTML += `<br/>value: ${value}`;
    }

    error(e) {
        this.container.innerHTML += `<br/>error: ${e}`;
    }

    complete() {
        this.container.innerHTML += `<br/>complete`;
    }
}

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//Create the observer using Observable.from
let source1 = Observable.from(numbers);

//2 different methods of subscribing
source1.subscribe(new MyObserver('div01'));
source1.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log(`complete`)
);

//Create observer from .create
let source2 = Observable.create(observer => {
    for(let n of numbers){

        if(n===5){
            observer.error(`Something went wrong!`);
        }

        observer.next(n);
    }

    observer.complete();
});

source2.subscribe(new MyObserver('div02'));

//Create observer from .create with a delay
let source3 = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length){
            setTimeout(produceValue, 2000);
        }
        else{
            observer.complete();
        }
    }

    produceValue();
});

source3.subscribe(new MyObserver('div03'));


let source4 = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);

        if(index < numbers.length){
            setTimeout(produceValue, 2000);
        }
        else{
            observer.complete();
        }
    }

    produceValue();
}).map(n => n * 2)
.filter(n => n > 4);

source4.subscribe(new MyObserver('div04'));