import Timer from './timer/timer.js';
import { dictionaries } from './dictionary/factory.js';
import { formatters } from './timer/formatter_factory.js';
import { letterProviders } from './letter_provider/factory.js';

//^[mniutcoy]+$/gi -- regex

export default class Boggle {

    options = {};
    _letters = null;
    _words = [];
    _dictionary = dictionaries['webster'];
    _letterProvider = letterProviders['static'];
    _regex = null;
    _timer = null;
    /**
     * 
     */
    constructor(options) {
        this._timer = new Timer(Object.assign({
            onStart : (timer) => { if(this.onPlay) { this.onPlay(this);} },
            onStop : (timer) => { if(this.onQuit) { this.onQuit(this);} }
        }, options));
        ['onPlay', 'onQuit', 'dictionary', 'timeFormat', 'timeLimit', 'letterProvider'].forEach((key) => {
            if(options[key]) {
                this[key] = options[key];
            }
        });
    }

    async definition(word) {
        return this._dictionary.definition(word);
    }

    get letterProvider() {
        return this.options.letterProvider ? this.options.letterProvider : 'static';
    }

    set letterProvider(value) {
        if(!letterProviders[value]) {
            throw `Letter provider named ${value} is not found!`;
        }
        this._letterProvider = letterProviders[value];
        this.options.letterProvider = value;
    }

    /**
     * Gets the onPlay callback function
     */
    get onPlay() {
        return this.options.onPlay;
    }

    /**
     * Sets the onPlay callback function
     * @param {Function} value The callback function
     */
    set onPlay(value) {
        if(typeof value !== 'function') {
            throw `onPlay callback must be a function, found ${typeof value}`;
        }
        this.options.onPlay = value;
    }

    /**
     * Gets the onQuit callback function
     */
    get onQuit() {
        return this.options.quit;
    }

    /**
     * Sets the onQuit callback function
     * @param {Function} value the callback function
     */
    set onQuit(value) {
        if(typeof value !== 'function') {
            throw `onQuit callback must be a function, found ${typeof value}`;
        }
        this.options.quit = value;
    }

    /**
     * Sets the games dictionary
     * @param {string} value the simple name of the dictionary service
     */
    set dictionary(value) {
        if(!dictionaries[value]) {
            throw `Dictionary named ${value} is not found!`;
        }
        this._dictionary = dictionaries[value]();
        this.options.dictionary = value;
    }

    /**
     * Gets the games dictionary service simple name
     */
    get dictionary() {
        return this.options.dictionary ? this.options.dictionary : 'webster';
    }

    /**
     * Sets the games time formatter.
     * @param {string} value the time format simple name
     */
    set timeFormat(value) {
        if(!formatters[value]) {
            throw `Time formatter named ${value} is not found!`;
        }
        this._timer.formatter = value;
     }

    /**
     * Gets the time format simple name
     */
    get timeFormat() {
        return this._timer.formatter;
    }

    /**
     * Sets the game's time limit
     * @param {int} value the time limit in seconds
     */
    set timeLimit(value) {
        if(!Number.isInteger(parseInt(value))) {
            throw `Time limit must be an integer, found ${typeof value}`;
        }
        this._timer.time = value;
    }

    /**
     * Get the games time limit
     */
    get timeLimit() {
        return this._timer.time;
    }

    /**
     * Get the game's letters
     */
    get letters() {
        return this._letters;
    }

    /**
     * Gets the game's words as an array.
     */
    get words() {
        return this._words;
    }

    get score() {
        let score = 0;
        for(word in this._words) {
            score += word.score;
        }
        return score;
    }

    /**
     * Adds a word to the game. 
     * @param {Promise} word 
     */
    async addWord(word) {
        //Promises, promises, promises
        return this._dictionary.definition(word).then((w) => {
            // The word has a definintion but is not 3 or more characters.
            if(w.word.length < 3) {
                throw `Word must be at least 3 characters, found ${w.word.length}!`;
            }
            return w;
        }).then((w) => {
            // The word has a definition, is at least 3 characters, but its already been 
            // played
            if(this._words.some((value) => value.word.toLowerCase() === w.word.toLowerCase())) {
                throw `The word ${w.word} is already used!`
            }
            return w;
        }).then ((w) => {
            // The word has a definition, is at leat 3 characters, has not been played,
            // but uses another character(s) other than the give letters.
            if(!w.word.match(this._regex)) {
                throw `The word ${w.word} contains an invalid letter(s)!`;
            }
            w.score = w.word.length;
            return w;
        }).then((w) => {
            // The word has a definition, is at least 3 characters, has not been played
            // used only the allowed letters. So it is a valid word :-)
            // Add a score property to the word object and push to the games list of 
            // played words.
            w.score = w.word.length;
            this._words.push(w);
            return w;
        });
    }

    /**
     * Starts the game play.
     */
    async play() {
        this._letterProvider.letters().then((l) => {
            this._letters = l;
            this._words = [];
            this._regex = new RegExp(`^[${this.letters}]+$`, 'gi');
            this._timer.start();
        });;
        
    }

    /**
     * Quits the game if currently playing
     */
    async quit() {
        if(this._timer.isRunning) {
            this._timer.stop();
        }
    }
}