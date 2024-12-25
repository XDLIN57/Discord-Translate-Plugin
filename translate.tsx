// ==UserScript==
// @name         Vencord Message Translator Plugin
// @namespace    https://github.com/Vencord/Vencord-Plugins
// @version      1.0
// @description  Adds a translation feature to Discord messages using Vencord
// @author       YourName
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(async () => {
    'use strict';

    const translateMessage = async (messageContent, targetLanguage) => {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(messageContent)}&langpair=en|${targetLanguage}`);
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return null;
        }
    };

    const addTranslateButton = () => {
        const contextMenu = document.querySelector('.contextMenu-3n2sgR');
        if (contextMenu && !document.querySelector('.translateMenuItem')) {
            const translateButton = document.createElement('div');
            translateButton.className = 'contextMenuItem-1r9wXr translateMenuItem';
            translateButton.textContent = 'Translate Message';
            translateButton.style.cursor = 'pointer';
            translateButton.addEventListener('click', () => {
                const selectedMessage = getSelectedMessage();
                if (selectedMessage) {
                    const originalMessage = selectedMessage.textContent;
                    const targetLanguage = prompt('Enter the target language code (e.g., "ru" for Russian, "fr" for French):', 'ru');
                    if (targetLanguage) {
                        translateMessage(originalMessage, targetLanguage).then(translatedText => {
                            if (translatedText) {
                                selectedMessage.textContent = translatedText;
                            } else {
                                alert('Translation failed. Please try again.');
                            }
                        });
                    }
                }
            });

            contextMenu.appendChild(translateButton);
        }
    };

    const getSelectedMessage = () => {
        const selectedElement = document.querySelector('.message-2qnXI6');
        return selectedElement ? selectedElement.querySelector('.markup-2BOw-j') : null;
    };

    const initializePlugin = () => {
        const observer = new MutationObserver(() => {
            addTranslateButton();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    initializePlugin();
})();
