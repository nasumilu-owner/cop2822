import Dictionary from './dictionary.js';

/**
 * Unoffical Google Dictionary 
 */
export default class GoogleDictionary extends Dictionary {

    constructor(options) {
        super(Object.assign({
            baseUrl : 'https://api.dictionaryapi.dev/api/v2/entries',
            audio : true
        }, options));
        this.language = (options.language) ? options.language : 'en';
    }

    get name() {
        return '(unofficial) Google Dictionary API';
    }

    get language() {
        return this.options.language;
    }

    set language(value) {
        this.options.language = value;
    }

    _serviceUrl(word) {
        return `${this.baseUrl}/${this.language}/${word}`
    }

    async _fetchDefinition(word) {
        let url = this._serviceUrl(word);
        return fetch(url).then(async (response) => { 
            return response.json(); 
        }).then(async (data) => {
            if(!data[0]) {
                return super._fetchDefinition(word);
            }
            return {
                word: word,
                phonetics: {
                    text: data[0].phonetics[0].text,
                    audio: data[0].phonetics[0].audio
                }
            };
        });
    }

}