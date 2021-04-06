import AjaxLetterProvider from './ajax.js';
import RandomLetterProvider from './random.js';
import { configs } from './../config.js';

export const letterProviders = {
    static : new AjaxLetterProvider(configs.letter_providers.static.url),
    random : new RandomLetterProvider(configs.letter_providers.random)
};