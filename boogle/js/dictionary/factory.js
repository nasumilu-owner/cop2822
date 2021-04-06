import GoogleDGoogleDictionary from './goggle.js';
import WebsterDictionary from './webster.js';
import {configs} from './../config.js';

export const dictionaries = {
    'google' : () => new GoogleDGoogleDictionary(configs.dictionary.google),
    'webster' : () => new WebsterDictionary(configs.dictionary.webster)
};