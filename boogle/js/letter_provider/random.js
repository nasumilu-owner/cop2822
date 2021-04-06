import LetterProvider from './provider.js';

export default class RandomLetterProvider extends LetterProvider {

    static consonants = 'bcdfghjklmnpqrstvwxz';
    static vowels = 'aeiou';

    constructor(options) {
        super();
        ['min', 'max', 'numVowels'].forEach((key) => {
            if (options[key]) {
                this[key] = options[key];
            }
        });
    }

    get min() {
        return this.options.min ? this.options.min : 5;
    }

    set min(value) {
        value = parseInt(value);
        if (!Number.isInteger(value)) {
            throw `Minumum number of letters must be an integer, found ${typeof value}`;
        }
        this.options.min = value;
    }

    get max() {
        return this.options.max ? this.options.max : 8;
    }

    set max(value) {
        value = parseInt(value);
        if (!Number.isInteger(value)) {
            throw `Maximum number of letters must be an integer, found ${typeof value}`;
        }
        this.options.max = value;
    }

    get numVowels() {
        return this.options.numVowels ? this.options.numVowels : 3;
    }

    set numVowels(value) {
        value = parseInt(value);
        if (!Number.isInteger(value)) {
            throw `Number of vowels must be an integer, found ${typeof value}`;
        }
        this.options.numVowels = value;
    }

    static randomLetter(letters) {
        return letters[Math.floor(Math.random() * letters.length)];
    }

    static randomLetters(letters, i) {
        let _letters = [];
        while(_letters.length < i) {
            let c = RandomLetterProvider.randomLetter(letters);
            if(!_letters.includes(c)) {
                _letters.push(c);
            }
        }
        return _letters;
    }

    async letters() {
        const numLetters = Math.floor(Math.random() * (this.max - this.min) + this.min);
        let c = RandomLetterProvider.randomLetters(RandomLetterProvider.consonants, numLetters);
        let v = RandomLetterProvider.randomLetters(RandomLetterProvider.vowels, this.numVowels);
        if(c.includes('q') && !v.includes('u')) {
            v[0] = 'u';
        }
        return c.concat(v).join('');
    }
}