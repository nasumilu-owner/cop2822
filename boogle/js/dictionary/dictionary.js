
export default class Dictionary {

    constructor(options) {  
        this.options = {
            audio: false,
            baseUrl: ''
        };
        ['audio', 'baseUrl'].forEach((key) => {
            this[key] = options[key];
        });
    }

    get name() {
        return 'Base Dictionary';
    }

    get audio() {
        return this.options.audio;
    }

    set audio(value) {
        this.options.audio = value;
    }

    get baseUrl() {
        return this.options.baseUrl;
    }

    set baseUrl(value) {
        this.options.baseUrl = value;
    }

    async _fetchDefinition(word) {
        throw `Word ${word} is not found in ${this.name} dictionary!`;
    }

    async definition(word) {
        return this._fetchDefinition(word);
    }

}