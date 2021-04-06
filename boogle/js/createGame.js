import Boggle from './boggle.js';
import { configs } from './config.js';
import { letterProviders } from './letter_provider/factory.js';
window.onload = () => {

    /**
     * Handle showing/hiding game settings.
     */
    document.querySelector('div#boggle-setting h3').onclick = (evt) => {
        let s = document.getElementById('setting');
        if (s.style.display === 'inline-block') {
            s.style.display = 'none';
        } else {
            //positioned left by 250 pixels less than the click x-coordinate
            s.style.left = evt.x - 250 + 'px';
            //positioned top by 20 pixels more than the click y-coordinate
            s.style.top = evt.y + 20 + 'px';
            s.style.display = 'inline-block';
        }
    };

    /**
     * Create the boggle game (boggle should be the only variable in global space).
     */
    var boggle = new Boggle(configs.boggle);

    // HTTP GET parameters
    const params = new URLSearchParams(window.location.search);

    // Iterate over possible settings to get everything in sync.
    ['timeFormat', 'timeLimit', 'dictionary', 'letterProvider'].forEach((key) => {
        let ele = document.getElementById(key);
        let value = params.has(key) ? params.get(key) : null;
        if (value) {
            ele.value = value;
            boggle[key] = value;
        } else {
            ele.value = boggle[key];
        }
    });
    /**
     * Select all button elements with a data-action attribute.
     * Iterate over each button and bind it to a Boggle game instance
     * action. 
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset
     * @see https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes
     */
    document.querySelectorAll('button[data-action]').forEach((ele) => {
        ele.onclick = boggle[ele.dataset.action].bind(boggle);
    });

    /**
     * Apply the game settings. Some settings require a game restart.
     */
    document.getElementById('apply-btn').onclick = (evt) => {
        document.getElementById('setting').style.display = 'none';
        ['timeFormat', 'timeLimit', 'dictionary', 'letterProvider'].forEach((key) => {
            boggle[key] = document.getElementById(key).value;
        });
    };

    /**
     * Add a callback for when a boogle game play starts
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset
     * @see https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes
     */
    boggle.onPlay = (game) => {
        document.getElementById('setting').style.display = 'none';
        let btn = document.querySelectorAll('button[data-action]').forEach((ele) => {
            if (ele.dataset.action === 'play') {
                ele.disabled = true;
                ele.style.cursor = 'not-allowed';
            } else {
                ele.disabled = false;
                ele.style.cursor = 'pointer';
            }
            let input = document.getElementById('words').innerHTML = '';
            document.getElementById('boggle-words').querySelectorAll('input').forEach(ele => ele.disabled = false);
            document.getElementById('letters').innerHTML = game.letters;
        })
    };

    /**
     * Add a callback for when a boogle game play quits
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset
     * @see https://html.spec.whatwg.org/#embedding-custom-non-visible-data-with-the-data-*-attributes
     */
    boggle.onQuit = (game) => {
        let btn = document.querySelectorAll('button[data-action]').forEach((ele) => {
            if (ele.dataset.action === 'quit') {
                ele.disabled = true;
                ele.style.cursor = 'not-allowed';
            } else {
                ele.disabled = false;
                ele.style.cursor = 'pointer';
            }
        })
        document.getElementById('boggle-words').querySelectorAll('input').forEach((ele) => {
            ele.disabled = true;
            if (ele.type === 'text') {
                ele.value = '';
            }
        });
        document.getElementById('letters').innerHTML = '';
    };

    /**
     * Add words to the boggle game.
     */
    document.getElementById('boggle-words').onsubmit = (evt) => {
        let input = document.getElementById('boggle-word');
        let word = input.value;
        input.value = '';
        boggle.addWord(word).then((w) => {
            let li = document.createElement('li');
            li.innerHTML = w.word;
            if(w.phonetics.audio) {
                let audio = new Audio(w.phonetics.audio);
                let icon = document.createElement('i');
                icon.classList.add('fas', 'fa-volume-up');
                icon.onclick = () => audio.play();
                li.append(icon);
            }
            document.getElementById('words').append(li);
            return w;
        }).then((w) => {
            let score = document.getElementById('score');
            score.textContent = parseInt(score.textContent) + w.score;
        }).catch((err) => {
            document.getElementById('message').textContent = err;
        });
        return false;
    };

    setInterval(() => {
        document.getElementById('message').textContent = '';
    }, 4000);

};