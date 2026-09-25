// ============================================================
// COGNICARE VOICE ASSISTANT
// Browser-based Text-to-Speech + Speech Recognition
// Multilingual Accessibility Support
// ============================================================

const CogniCareVoice = {

    recognition: null,

    isListening: false,

    // Current selected language
    currentLanguage: "en-IN",

    // --------------------------------------------------------
    // SUPPORTED LANGUAGES
    // --------------------------------------------------------

    languages: {

        "en-IN": {
            name: "English",
            speech: "en-IN"
        },

        "hi-IN": {
            name: "हिन्दी",
            speech: "hi-IN"
        },

        "as-IN": {
            name: "অসমীয়া",
            speech: "as-IN"
        },

        "bn-IN": {
            name: "বাংলা",
            speech: "bn-IN"
        }

    },


    // --------------------------------------------------------
    // SET LANGUAGE
    // --------------------------------------------------------

    setLanguage(languageCode) {

        if (
            this.languages[languageCode]
        ) {

            this.currentLanguage =
                languageCode;

            localStorage.setItem(
                "cognicare_language",
                languageCode
            );

        }

    },


    // --------------------------------------------------------
    // GET LANGUAGE
    // --------------------------------------------------------

    getLanguage() {

        const savedLanguage =
            localStorage.getItem(
                "cognicare_language"
            );


        if (
            savedLanguage &&
            this.languages[savedLanguage]
        ) {

            this.currentLanguage =
                savedLanguage;

        }


        return this.currentLanguage;

    },


    // --------------------------------------------------------
    // GET LANGUAGE NAME
    // --------------------------------------------------------

    getLanguageName() {

        const language =
            this.getLanguage();


        return this.languages[language]
            ? this.languages[language].name
            : "English";

    },


    // --------------------------------------------------------
    // SPEAK TEXT
    // --------------------------------------------------------

    speak(text) {

        if (
            !("speechSynthesis" in window)
        ) {

            console.warn(
                "Speech synthesis is not supported."
            );

            return;

        }


        if (!text) {

            return;

        }


        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        utterance.lang =
            this.getLanguage();


        utterance.rate =
            0.85;


        utterance.pitch =
            1;


        utterance.volume =
            1;


        window.speechSynthesis.speak(
            utterance
        );

    },


    // --------------------------------------------------------
    // STOP SPEAKING
    // --------------------------------------------------------

    stop() {

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();

        }

    },


    // --------------------------------------------------------
    // START VOICE INPUT
    // --------------------------------------------------------

    startListening(
        onResult,
        onError,
        onEnd
    ) {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Voice input is not supported by this browser. Please use Google Chrome."
            );

            return;

        }


        if (this.isListening) {

            return;

        }


        this.recognition =
            new SpeechRecognition();


        // Use selected language

        this.recognition.lang =
            this.getLanguage();


        this.recognition.continuous =
            false;


        this.recognition.interimResults =
            false;


        this.recognition.maxAlternatives =
            1;


        this.isListening =
            true;


        this.recognition.onresult =
            function(event) {

                const transcript =
                    event
                        .results[0][0]
                        .transcript;


                if (onResult) {

                    onResult(
                        transcript
                    );

                }

            };


        this.recognition.onerror =
            function(event) {

                console.error(
                    "Voice recognition error:",
                    event.error
                );


                if (onError) {

                    onError(
                        event.error
                    );

                }

            };


        this.recognition.onend =
            function() {

                CogniCareVoice.isListening =
                    false;


                if (onEnd) {

                    onEnd();

                }

            };


        this.recognition.start();

    },


    // --------------------------------------------------------
    // STOP VOICE INPUT
    // --------------------------------------------------------

    stopListening() {

        if (
            this.recognition &&
            this.isListening
        ) {

            this.recognition.stop();

        }

    }

};