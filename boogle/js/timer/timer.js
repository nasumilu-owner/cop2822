import { formatters } from './formatter_factory.js';

export default class Timer {

    /**
     * Constructs a very basic count down timer.
     */
    constructor(options) {
        this.options = {
            time: 60,
            formatter: 'numerical',
            timerClass: '.timer'
        };
        ['time', 'formatter', 'timerClass', 'onStop', 'onStart'].forEach((key) => {
            if(options[key]) {
                this[key] = options[key];
            }
        });
        this._timer = null;
        this.counter = 0;
        this._ui = null;
    }

    get ui() {
        if(null === this._ui) {
            this._ui = document.querySelector(this.timerClass);
        }
        return this._ui;
    }

    get isRunning() {
        return this._timer !== null;
    }

    get onStart() {
        return this.options.onStart;
    }

    set onStart(value) {
        this.options.onStart = value;
    }

    get onStop() {
        return this.options.onStop;
    }

    set onStop(value) {
        this.options.onStop = value;
    }

    get timerClass() {
        return this.options.timerClass;
    }

    set timerClass(value) {
        this.options.timerClass = value;
    }

    /**
     * Gets the formatter function used to convert the timer to a
     * string.
     */
    get formatter() {
        return this.options.formatter;
    }

    /**
     * Sets the formatter function used to convert the timer to a
     * string.
     */
    set formatter(value) {
        this.options.formatter = value;
        this._updateUI();
    }

    /**
     * Gets the timer's start time.
     */
    get time() {
        return this.options.time;
    }

    /**
     * Sets the timer's start time
     */
    set time(value) {
        this.options.time = parseInt(value);
    }

    /**
     * The current interval of the timer.
     */
    get interval() {
        return this.counter;
    }

    /**
     * Internal method to decriment the timer and optional call
     * callbacks.
     */
    _countDown() {
        this.counter--;
        this._updateUI(this);
        if(this.options.onInterval) {
            this.options.onInterval(this);
        }
        this._updateUI();
        if(this.counter === 0) {
            this.stop();            
        }
    }


    /**
     * Updates the timers HTMLElement if configured.
     */
    _updateUI() {
        if(this.ui) {
            this.ui.innerHTML = formatters[this.options.formatter](this);
        }
    }

    /**
     * Start the timer and call the optional onStart callback.
     */
    start() {
        if(this._timer !== null) {
            throw "Timer already running!";
        }
        this.counter = this.options.time;
        this._timer = setInterval(this._countDown.bind(this), 1000);
        if(this.onStart) {
            this.options.onStart(this);
        }
    }

    /**
     * Stops the timer.
     */
    stop() {
        if(this._timer === null) {
            throw "Timer is not running!";
        }
        clearInterval(this._timer);
        this._timer = null;
        this.counter = 0;
        this._updateUI();
        if(this.onStop) {
            this.options.onStop(this);
        }
    }
}