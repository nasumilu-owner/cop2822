export const configs = {
    boggle: {
        /**
         * The game's timer options
         */
        timeLimit: 120,
        /**
         * The games timer format
         * 
         *  + numerical       - 00:00
         *  + lexical         - T-minus 00 minutes and 00 seconds
         *  + lexical_compact - T-minus 00:00
         */
        timeFormat: 'numerical',
        /**
         * The games letter provider service
         * 
         *  + static    - Static set of words
         *  + random    - Generates a random set of letters (see letter_providers.random config)
         */
        letterProvider: 'static',
        /**
         * The games dictionary service.
         * 
         *  + webster - uses the Merriam-Webster dictionary API (Service requires an api key at configs.webster.apiKey)
         *  + google  - use the unofficial Google Dictionary API 
         */
        dictionary: 'webster',
    },
    dictionary: {
        // Webster dictionary options
        webster: {
            apiKey: 'fb62232f-8b96-4d2a-a979-87dcaa84bdd8',
            audio: true
        },
        // Unofficial google dictionary settings.
        google: {
            language: 'en',
            audio: true
        }
    },
    letter_providers: {
        random: {
            min: 5,
            max: 10,
            numVowels: 3
        },
        static: {
            url: '/js/words.json'
        }
    }
};