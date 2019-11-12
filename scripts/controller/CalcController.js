class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._displayCalcEl = document.querySelector("#display");
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();

    }

    initialize() {

        this.setLastNumberToDisplay();

        document.querySelectorAll('.row:nth-child(2) > .btn:nth-of-type(2)').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });

        });

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;

            this._audio.play();

        }

    }

    initKeyBoard() {

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch(e.key) {

                case 'Escape':
                    this.clear();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

            }

        });

    }

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    }

    clear() {

        this._operation = [];

        this._lastNumber = '';

        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry() {

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {
        
        this._operation[this._operation.length - 1] = value;

    }

    isOperator(value) {

        return (['+', '-', '*', '%', '/', 'x²', '√', '¹/x', '±'].indexOf(value) > -1);

    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult() {

        try {

            return eval(this._operation.join(""));

        } catch(e) {

            setTimeout(() => {

                this.setError();

            }, 1000);

        }

    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            if (this._lastOperator == 'x²') {
    
                let firstItem = this._operation[0];
                this._operation = [Math.pow(firstItem, 2)];
    
            } else if (this._lastOperator == '¹/x') {

                let firstItem = this._operation[0];
                this._operation = [1 / firstItem];

            } else if (this._lastOperator == '±') {

                let firstItem = this._operation[0] * -1;
                this._operation = [firstItem];

            } else if (this._operation[-1] === '√') {

                this._operation = [Math.sqrt(this._operation[0])];

            } else {

                let firstItem = this._operation[0];
                this._operation = [firstItem, this._lastOperator, this._lastNumber];

            }
            
        } else if (this._operation.length > 3) {

            last = this._operation.pop();

            if (last == '%') {

                this._lastNumber = this.getResult();
    
                this._lastNumber /= 100;
    
                this._operation = [this._lastNumber];
    
            }

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        this._operation = [result];

        if (last) this._operation.push(last);

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {

                lastItem = this._operation[i];
                break;

            }

        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);

            } else {

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();

                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }

    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();

    }

    setError() {

        this.displayCalc = "Error";

    }

    execBtn(value) {

        this.playAudio();

        switch(value) {

            case 'CE':
                this.clearEntry();
                break;
            case 'C':
                this.clear();
                break;
            case '←':

                break;
            case 'X':
                this.addOperation('*');
                break;
            case '÷':
                this.addOperation('/');
                break;
            case '±':
                this.addOperation(value);
                this.calc();
                break;
            case '%':
            case '√':
            case 'x²':
            case '¹/x':
            case '-':
            case '+':
                this.addOperation(value);
                break;
            case ',':
                this.addDot();
                break;
            case '=':
                this.calc();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;

        }

    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll(".btn");
        
        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, 'click drag', e => {

                let textBtn = btn.innerHTML;

                this.execBtn(textBtn);

            })

        });

    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value) {

        if (value.toString().length > 10) {

            this.setError();

            return false;

        }

        this._displayCalcEl.innerHTML = value;

    }

}