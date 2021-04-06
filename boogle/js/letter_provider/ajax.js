import LetterProvider from './provider.js';

export default class AjaxLetterProvider extends LetterProvider {

    constructor(url) {
        super();
        this.url = url;
    }

    get url() {
        return this.options.url;
    }

    set url(value) {
        this.options.url = value;
    }

    async letters() {
        return fetch(this.url)
            .then(response => response.json())
            .then((data) => {
                return data[Math.floor(Math.random() * data.length)];
            });
    }
}