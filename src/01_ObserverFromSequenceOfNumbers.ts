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

let source1 = Observable.from(numbers);
source1.subscribe(new MyObserver('div01'));
