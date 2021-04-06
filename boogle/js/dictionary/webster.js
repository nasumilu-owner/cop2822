import Dictionary from './dictionary.js';

export default class WebsterDictionary extends Dictionary {

    constructor(options) {
        super(Object.assign({
            baseUrl: 'https://dictionaryapi.com/api/v3/references/collegiate/json/'
        }, options));
        if(!options.apiKey) {
            throw 'API Key required, none found!';
        }
        this.apiKey = options.apiKey;
    }

    get name() {
        return 'Merriam-Webseter';
    }
    
    _audioUrl(audio) {
        let matches = audio.match(/gg|bix|^[a-z]/gi);
        let subdirectory = (matches[0]) ? matches[0] : 'number';
        return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audio}.mp3`;
    }

    _serviceUrl(word) {
        return `${this.baseUrl}/${word}?key=${this.apiKey}`;
    }

    set apiKey(value) {
        this.options.apiKey = value;
    }

    get apiKey() {
        return this.options.apiKey;
    }

    async _fetchDefinition(word) {
        let url = this._serviceUrl(word);
        return fetch(url).then(async (response) => { 
            return response.json(); 
        }).then(async (data) => {
            if(!data[0].meta) {
                return super._fetchDefinition(word);
            }
            return {
                word: word,
                phonetics: {
                    text: (data[0].hwi.prs) ? data[0].hwi.prs[0].mw : null,
                    audio: (data[0].hwi.prs) ? this._audioUrl(data[0].hwi.prs[0].sound.audio) : null
                }
            };
        });
    }
}