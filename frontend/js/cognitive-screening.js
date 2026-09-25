// ============================================================
// COGNICARE - COGNITIVE SYMPTOM SCREENING
// Multilingual Voice-Assisted Symptom Screening
// PostgreSQL Result Saving
// ============================================================

let currentQuestion = 0;
let answers = [];


// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000";

const USER_ID = Number(JSON.parse(localStorage.getItem("cognicare_user") || "{}").user_id || 0);


// ============================================================
// SUPPORTED LANGUAGES
// ============================================================

const SCREENING_LANGUAGES = {

    "en-IN": {

        name: "English",

        introTitle:
            "🧠 Let's Understand Your Concerns",

        intro1:
            "Hello! I will ask you about some changes that you may have noticed in memory, communication, daily activities, orientation and behaviour.",

        intro2:
            "There are no right or wrong answers. Please answer based on what you have experienced recently.",

        howItWorks:
            "How it works:",

        howItWorksText:
            "I will describe a symptom and you can tell me whether it happens:",

        frequency:
            "Never • Sometimes • Often • Frequently",

        voiceInstruction:
            "You can also use the voice assistant to hear the questions and answer by speaking.",

        important:
            "Important:",

        screeningWarning:
            "This is a supportive symptom-screening feature. It does not diagnose dementia or determine a medical dementia stage.",

        professional:
            "A healthcare professional should evaluate persistent or concerning symptoms.",

        start:
            "Start Symptom Screening →",

        answerQuestion:
            "How often does this happen?",

        hearQuestion:
            "🔊 Hear Question",

        speakAnswer:
            "🎙️ Speak Answer",

        voiceStatus:
            "You can listen to the question or answer using your voice.",

        listening:
            "🎙️ Listening... Please say Never, Sometimes, Often, or Frequently.",

        notUnderstood:
            "❓ I didn't understand. Please say Never, Sometimes, Often, or Frequently.",

        sorryNotUnderstood:
            "Sorry, I didn't understand. Please say Never, Sometimes, Often, or Frequently.",

        reading:
            "🔊 Reading the question...",

        heard:
            "✅ Heard:",

        selected:
            "Selected:",

        next:
            "Next →",

        resultTitle:
            "Screening Complete",

        score:
            "Screening Score",

        symptomProfile:
            "📊 Symptom Profile",

        recommendation:
            "💡 Recommended Next Step",

        medicalImportant:
            "Important:",

        medicalNote:
            "This screening result is not a medical diagnosis. Cognitive symptoms can have many possible causes, and only a qualified healthcare professional can assess the cause and diagnose a condition.",

        takeAgain:
            "Take Screening Again",

        fewTitle:
            "Few Symptoms Reported",

        fewMessage:
            "Your responses indicate that relatively few of the listed cognitive symptoms were reported frequently.",

        fewRecommendation:
            "Continue healthy routines, social interaction, cognitive activities, and regular observation of any changes.",

        someTitle:
            "Some Cognitive Symptoms Reported",

        someMessage:
            "Your responses indicate that some of the listed cognitive symptoms occur sometimes or more frequently.",

        someRecommendation:
            "Consider discussing persistent or increasing symptoms with a healthcare professional. Continue using CogniCare activities to support cognitive engagement.",

        severalTitle:
            "Several Symptoms Reported",

        severalMessage:
            "Your responses indicate that several of the listed cognitive symptoms were reported relatively frequently.",

        severalRecommendation:
            "A healthcare professional should evaluate persistent or increasing symptoms and help determine their possible causes.",

        saved:
            "Screening result saved successfully.",

        saveFailed:
            "Screening completed, but the result could not be saved.",

        serverFailed:
            "Screening completed, but the server could not be reached."

    },


    // ========================================================
    // HINDI
    // ========================================================

    "hi-IN": {

        name: "हिन्दी",

        introTitle:
            "🧠 आइए आपकी चिंताओं को समझते हैं",

        intro1:
            "नमस्ते! मैं आपसे याददाश्त, बातचीत, रोज़मर्रा के काम, समय और स्थान की समझ तथा व्यवहार में महसूस होने वाले कुछ बदलावों के बारे में पूछूँगा।",

        intro2:
            "इसमें कोई सही या गलत उत्तर नहीं है। कृपया हाल ही में आपने जो अनुभव किया है उसके आधार पर उत्तर दें।",

        howItWorks:
            "यह कैसे काम करता है:",

        howItWorksText:
            "मैं एक लक्षण बताऊँगा और आप बताएँगे कि यह कितनी बार होता है:",

        frequency:
            "कभी नहीं • कभी-कभी • अक्सर • बहुत बार",

        voiceInstruction:
            "आप प्रश्न सुनने और बोलकर उत्तर देने के लिए वॉइस असिस्टेंट का भी उपयोग कर सकते हैं।",

        important:
            "महत्वपूर्ण:",

        screeningWarning:
            "यह एक सहायक लक्षण-जाँच सुविधा है। यह डिमेंशिया का निदान नहीं करती और डिमेंशिया की कोई चिकित्सीय अवस्था निर्धारित नहीं करती।",

        professional:
            "लगातार या चिंताजनक लक्षण होने पर स्वास्थ्य विशेषज्ञ से सलाह लें।",

        start:
            "लक्षण-जाँच शुरू करें →",

        answerQuestion:
            "यह कितनी बार होता है?",

        hearQuestion:
            "🔊 प्रश्न सुनें",

        speakAnswer:
            "🎙️ उत्तर बोलें",

        voiceStatus:
            "आप प्रश्न सुन सकते हैं या बोलकर उत्तर दे सकते हैं।",

        listening:
            "🎙️ सुन रहा हूँ... कृपया कहें: कभी नहीं, कभी-कभी, अक्सर, या बहुत बार।",

        notUnderstood:
            "❓ मैं समझ नहीं पाया। कृपया कहें: कभी नहीं, कभी-कभी, अक्सर, या बहुत बार।",

        sorryNotUnderstood:
            "माफ़ कीजिए, मैं समझ नहीं पाया। कृपया कहें: कभी नहीं, कभी-कभी, अक्सर, या बहुत बार।",

        reading:
            "🔊 प्रश्न पढ़ा जा रहा है...",

        heard:
            "✅ सुना:",

        selected:
            "चयनित:",

        next:
            "अगला →",

        resultTitle:
            "जाँच पूरी हुई",

        score:
            "जाँच स्कोर",

        symptomProfile:
            "📊 लक्षण प्रोफ़ाइल",

        recommendation:
            "💡 अगला सुझाया गया कदम",

        medicalImportant:
            "महत्वपूर्ण:",

        medicalNote:
            "यह जाँच परिणाम चिकित्सा निदान नहीं है। संज्ञानात्मक लक्षणों के कई संभावित कारण हो सकते हैं। केवल योग्य स्वास्थ्य विशेषज्ञ ही कारण का मूल्यांकन और किसी बीमारी का निदान कर सकते हैं।",

        takeAgain:
            "जाँच दोबारा करें",

        fewTitle:
            "कम लक्षण बताए गए",

        fewMessage:
            "आपके उत्तरों के अनुसार सूची में दिए गए अपेक्षाकृत कम संज्ञानात्मक लक्षण बार-बार होने की जानकारी दी गई है।",

        fewRecommendation:
            "स्वस्थ दिनचर्या, सामाजिक बातचीत और संज्ञानात्मक गतिविधियाँ जारी रखें तथा किसी भी बदलाव पर नियमित ध्यान दें।",

        someTitle:
            "कुछ संज्ञानात्मक लक्षण बताए गए",

        someMessage:
            "आपके उत्तरों के अनुसार सूची में दिए गए कुछ संज्ञानात्मक लक्षण कभी-कभी या उससे अधिक बार होते हैं।",

        someRecommendation:
            "यदि लक्षण लगातार बने रहते हैं या बढ़ रहे हैं, तो स्वास्थ्य विशेषज्ञ से चर्चा करने पर विचार करें। संज्ञानात्मक गतिविधियों के लिए CogniCare का उपयोग जारी रखें।",

        severalTitle:
            "कई लक्षण बताए गए",

        severalMessage:
            "आपके उत्तरों के अनुसार सूची में दिए गए कई संज्ञानात्मक लक्षण अपेक्षाकृत बार-बार होते हैं।",

        severalRecommendation:
            "लगातार या बढ़ते हुए लक्षणों के लिए स्वास्थ्य विशेषज्ञ से मूल्यांकन करवाएँ और उनके संभावित कारणों पर चर्चा करें।",

        saved:
            "जाँच परिणाम सफलतापूर्वक सेव हो गया।",

        saveFailed:
            "जाँच पूरी हुई, लेकिन परिणाम सेव नहीं हो सका।",

        serverFailed:
            "जाँच पूरी हुई, लेकिन सर्वर से संपर्क नहीं हो सका।"

    },


    // ========================================================
    // ASSAMESE
    // ========================================================

    "as-IN": {

        name: "অসমীয়া",

        introTitle:
            "🧠 আহক আপোনাৰ চিন্তাবোৰ বুজিবলৈ চেষ্টা কৰোঁ",

        intro1:
            "নমস্কাৰ! মই আপোনাক স্মৃতি, কথা-বতৰা, দৈনন্দিন কাম-কাজ, সময় আৰু স্থানৰ বোধ, আৰু আচৰণত অনুভৱ কৰা কিছুমান পৰিৱৰ্তনৰ বিষয়ে সুধিম।",

        intro2:
            "ইয়াত কোনো শুদ্ধ বা ভুল উত্তৰ নাই। অনুগ্ৰহ কৰি শেহতীয়াকৈ আপুনি অনুভৱ কৰা অভিজ্ঞতাৰ ভিত্তিত উত্তৰ দিয়ক।",

        howItWorks:
            "ই কেনেকৈ কাম কৰে:",

        howItWorksText:
            "মই এটা লক্ষণৰ বিষয়ে ক'ম আৰু আপুনি ক'ব এইটো কিমান সঘনাই হয়:",

        frequency:
            "কেতিয়াও নহয় • কেতিয়াবা • প্ৰায়ে • সঘনাই",

        voiceInstruction:
            "আপুনি প্ৰশ্ন শুনিবলৈ আৰু কথা কৈ উত্তৰ দিবলৈ ভইচ সহায়ক ব্যৱহাৰ কৰিব পাৰে।",

        important:
            "গুৰুত্বপূৰ্ণ:",

        screeningWarning:
            "এইটো এটা সহায়ক লক্ষণ-পৰীক্ষা সুবিধা। ই ডিমেনচিয়াৰ ৰোগ নিৰ্ণয় নকৰে আৰু ডিমেনচিয়াৰ কোনো চিকিৎসাগত পৰ্যায় নিৰ্ধাৰণ নকৰে।",

        professional:
            "যদি লক্ষণবোৰ স্থায়ী বা চিন্তাজনক হয়, তেন্তে স্বাস্থ্য বিশেষজ্ঞৰ পৰামৰ্শ লওক।",

        start:
            "লক্ষণ-পৰীক্ষা আৰম্ভ কৰক →",

        answerQuestion:
            "এইটো কিমান সঘনাই হয়?",

        hearQuestion:
            "🔊 প্ৰশ্ন শুনক",

        speakAnswer:
            "🎙️ উত্তৰ কওক",

        voiceStatus:
            "আপুনি প্ৰশ্ন শুনিব পাৰে বা কথা কৈ উত্তৰ দিব পাৰে।",

        listening:
            "🎙️ শুনি আছোঁ... অনুগ্ৰহ কৰি কওক: কেতিয়াও নহয়, কেতিয়াবা, প্ৰায়ে, বা সঘনাই।",

        notUnderstood:
            "❓ মই বুজি নাপালোঁ। অনুগ্ৰহ কৰি কওক: কেতিয়াও নহয়, কেতিয়াবা, প্ৰায়ে, বা সঘনাই।",

        sorryNotUnderstood:
            "ক্ষমা কৰিব, মই বুজি নাপালোঁ। অনুগ্ৰহ কৰি কওক: কেতিয়াও নহয়, কেতিয়াবা, প্ৰায়ে, বা সঘনাই।",

        reading:
            "🔊 প্ৰশ্নটো পঢ়ি থকা হৈছে...",

        heard:
            "✅ শুনিলোঁ:",

        selected:
            "নিৰ্বাচিত:",

        next:
            "পৰৱৰ্তী →",

        resultTitle:
            "পৰীক্ষা সম্পূৰ্ণ হ'ল",

        score:
            "পৰীক্ষাৰ স্ক'ৰ",

        symptomProfile:
            "📊 লক্ষণৰ প্ৰফাইল",

        recommendation:
            "💡 পৰৱৰ্তী পৰামৰ্শ",

        medicalImportant:
            "গুৰুত্বপূৰ্ণ:",

        medicalNote:
            "এই পৰীক্ষাৰ ফলাফল কোনো চিকিৎসাগত ৰোগ নিৰ্ণয় নহয়। সংজ্ঞানাত্মক লক্ষণৰ বহুতো সম্ভাৱ্য কাৰণ থাকিব পাৰে। কেৱল যোগ্য স্বাস্থ্য বিশেষজ্ঞই কাৰণ মূল্যায়ন কৰি কোনো ৰোগ নিৰ্ণয় কৰিব পাৰে।",

        takeAgain:
            "পৰীক্ষা পুনৰ কৰক",

        fewTitle:
            "কম সংখ্যক লক্ষণ উল্লেখ কৰা হৈছে",

        fewMessage:
            "আপোনাৰ উত্তৰ অনুসৰি তালিকাভুক্ত তুলনামূলকভাৱে কম সংখ্যক সংজ্ঞানাত্মক লক্ষণ সঘনাই হোৱা বুলি উল্লেখ কৰা হৈছে।",

        fewRecommendation:
            "স্বাস্থ্যকৰ দৈনন্দিন অভ্যাস, সামাজিক যোগাযোগ আৰু সংজ্ঞানাত্মক কাৰ্যকলাপ অব্যাহত ৰাখক আৰু কোনো পৰিৱৰ্তনৰ ওপৰত নিয়মীয়াকৈ লক্ষ্য ৰাখক।",

        someTitle:
            "কিছুমান সংজ্ঞানাত্মক লক্ষণ উল্লেখ কৰা হৈছে",

        someMessage:
            "আপোনাৰ উত্তৰ অনুসৰি কিছুমান সংজ্ঞানাত্মক লক্ষণ কেতিয়াবা বা তাতকৈ অধিক সঘনাই ঘটে।",

        someRecommendation:
            "যদি লক্ষণবোৰ স্থায়ী হৈ থাকে বা বৃদ্ধি পায়, তেন্তে স্বাস্থ্য বিশেষজ্ঞৰ সৈতে আলোচনা কৰাৰ কথা বিবেচনা কৰক। সংজ্ঞানাত্মক ব্যস্ততাৰ বাবে CogniCare কাৰ্যকলাপ অব্যাহত ৰাখক।",

        severalTitle:
            "কেইবাটাও লক্ষণ উল্লেখ কৰা হৈছে",

        severalMessage:
            "আপোনাৰ উত্তৰ অনুসৰি তালিকাভুক্ত কেইবাটাও সংজ্ঞানাত্মক লক্ষণ তুলনামূলকভাৱে সঘনাই হোৱা বুলি উল্লেখ কৰা হৈছে।",

        severalRecommendation:
            "স্থায়ী বা বৃদ্ধি পোৱা লক্ষণৰ বাবে স্বাস্থ্য বিশেষজ্ঞৰ মূল্যায়ন লওক আৰু সম্ভাৱ্য কাৰণসমূহৰ বিষয়ে আলোচনা কৰক।",

        saved:
            "পৰীক্ষাৰ ফলাফল সফলভাৱে সংৰক্ষণ কৰা হৈছে।",

        saveFailed:
            "পৰীক্ষা সম্পূৰ্ণ হ'ল, কিন্তু ফলাফল সংৰক্ষণ কৰিব পৰা নগ'ল।",

        serverFailed:
            "পৰীক্ষা সম্পূৰ্ণ হ'ল, কিন্তু চাৰ্ভাৰৰ সৈতে সংযোগ কৰিব পৰা নগ'ল।"

    },


    // ========================================================
    // BENGALI
    // ========================================================

    "bn-IN": {

        name: "বাংলা",

        introTitle:
            "🧠 আসুন আপনার সমস্যাগুলি বুঝতে চেষ্টা করি",

        intro1:
            "নমস্কার! আমি আপনাকে স্মৃতি, কথাবার্তা, দৈনন্দিন কাজ, সময় ও স্থান সম্পর্কে বোঝাপড়া এবং আচরণে অনুভূত কিছু পরিবর্তন সম্পর্কে প্রশ্ন করব।",

        intro2:
            "এখানে কোনো সঠিক বা ভুল উত্তর নেই। অনুগ্রহ করে সম্প্রতি আপনি যা অনুভব করেছেন তার ভিত্তিতে উত্তর দিন।",

        howItWorks:
            "এটি যেভাবে কাজ করে:",

        howItWorksText:
            "আমি একটি উপসর্গের কথা বলব এবং আপনি বলবেন এটি কতবার ঘটে:",

        frequency:
            "কখনও নয় • মাঝে মাঝে • প্রায়ই • ঘন ঘন",

        voiceInstruction:
            "আপনি প্রশ্ন শুনতে এবং কথা বলে উত্তর দিতে ভয়েস সহায়ক ব্যবহার করতে পারেন।",

        important:
            "গুরুত্বপূর্ণ:",

        screeningWarning:
            "এটি একটি সহায়ক উপসর্গ-স্ক্রিনিং সুবিধা। এটি ডিমেনশিয়া নির্ণয় করে না এবং ডিমেনশিয়ার কোনো চিকিৎসাগত পর্যায় নির্ধারণ করে না।",

        professional:
            "উপসর্গগুলি স্থায়ী বা উদ্বেগজনক হলে একজন স্বাস্থ্য বিশেষজ্ঞের পরামর্শ নিন।",

        start:
            "উপসর্গ স্ক্রিনিং শুরু করুন →",

        answerQuestion:
            "এটি কতবার ঘটে?",

        hearQuestion:
            "🔊 প্রশ্ন শুনুন",

        speakAnswer:
            "🎙️ উত্তর বলুন",

        voiceStatus:
            "আপনি প্রশ্ন শুনতে পারেন অথবা কথা বলে উত্তর দিতে পারেন।",

        listening:
            "🎙️ শুনছি... অনুগ্রহ করে বলুন: কখনও নয়, মাঝে মাঝে, প্রায়ই, অথবা ঘন ঘন।",

        notUnderstood:
            "❓ আমি বুঝতে পারিনি। অনুগ্রহ করে বলুন: কখনও নয়, মাঝে মাঝে, প্রায়ই, অথবা ঘন ঘন।",

        sorryNotUnderstood:
            "দুঃখিত, আমি বুঝতে পারিনি। অনুগ্রহ করে বলুন: কখনও নয়, মাঝে মাঝে, প্রায়ই, অথবা ঘন ঘন।",

        reading:
            "🔊 প্রশ্নটি পড়া হচ্ছে...",

        heard:
            "✅ শুনেছি:",

        selected:
            "নির্বাচিত:",

        next:
            "পরবর্তী →",

        resultTitle:
            "স্ক্রিনিং সম্পন্ন হয়েছে",

        score:
            "স্ক্রিনিং স্কোর",

        symptomProfile:
            "📊 উপসর্গের প্রোফাইল",

        recommendation:
            "💡 পরবর্তী পরামর্শ",

        medicalImportant:
            "গুরুত্বপূর্ণ:",

        medicalNote:
            "এই স্ক্রিনিং ফলাফল কোনো চিকিৎসাগত রোগ নির্ণয় নয়। জ্ঞানীয় উপসর্গের অনেক সম্ভাব্য কারণ থাকতে পারে। শুধুমাত্র একজন যোগ্য স্বাস্থ্য বিশেষজ্ঞ কারণ মূল্যায়ন করে কোনো রোগ নির্ণয় করতে পারেন।",

        takeAgain:
            "আবার স্ক্রিনিং করুন",

        fewTitle:
            "কম সংখ্যক উপসর্গ রিপোর্ট করা হয়েছে",

        fewMessage:
            "আপনার উত্তর অনুযায়ী তালিকাভুক্ত তুলনামূলকভাবে কম সংখ্যক জ্ঞানীয় উপসর্গ ঘন ঘন ঘটে বলে জানানো হয়েছে।",

        fewRecommendation:
            "স্বাস্থ্যকর দৈনন্দিন অভ্যাস, সামাজিক যোগাযোগ এবং জ্ঞানীয় কার্যকলাপ চালিয়ে যান এবং যেকোনো পরিবর্তনের দিকে নিয়মিত নজর রাখুন।",

        someTitle:
            "কিছু জ্ঞানীয় উপসর্গ রিপোর্ট করা হয়েছে",

        someMessage:
            "আপনার উত্তর অনুযায়ী তালিকাভুক্ত কিছু জ্ঞানীয় উপসর্গ মাঝে মাঝে বা তার বেশি ঘটে।",

        someRecommendation:
            "উপসর্গগুলি স্থায়ী হলে বা বাড়তে থাকলে একজন স্বাস্থ্য বিশেষজ্ঞের সঙ্গে আলোচনা করার কথা বিবেচনা করুন। জ্ঞানীয় ব্যস্ততার জন্য CogniCare কার্যকলাপ চালিয়ে যান।",

        severalTitle:
            "বেশ কয়েকটি উপসর্গ রিপোর্ট করা হয়েছে",

        severalMessage:
            "আপনার উত্তর অনুযায়ী তালিকাভুক্ত বেশ কয়েকটি জ্ঞানীয় উপসর্গ তুলনামূলকভাবে ঘন ঘন ঘটে বলে জানানো হয়েছে।",

        severalRecommendation:
            "স্থায়ী বা বাড়তে থাকা উপসর্গের জন্য একজন স্বাস্থ্য বিশেষজ্ঞের মূল্যায়ন নিন এবং সম্ভাব্য কারণগুলি নিয়ে আলোচনা করুন।",

        saved:
            "স্ক্রিনিং ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে।",

        saveFailed:
            "স্ক্রিনিং সম্পন্ন হয়েছে, কিন্তু ফলাফল সংরক্ষণ করা যায়নি।",

        serverFailed:
            "স্ক্রিনিং সম্পন্ন হয়েছে, কিন্তু সার্ভারের সঙ্গে সংযোগ করা যায়নি।"

    }

};


// ============================================================
// MULTILINGUAL SYMPTOM QUESTIONS
// ============================================================

const symptoms = [

    {
        category: "Memory",

        question:
            "Do you forget recently learned information or conversations?",

        translations: {
            "hi-IN":
                "क्या आप हाल ही में सीखी गई जानकारी या हुई बातचीत भूल जाते हैं?",

            "as-IN":
                "আপুনি শেহতীয়াকৈ শিকা তথ্য বা হোৱা কথা-বতৰা পাহৰি যায় নেকি?",

            "bn-IN":
                "আপনি কি সম্প্রতি শেখা তথ্য বা কথোপকথন ভুলে যান?"
        }
    },


    {
        category: "Memory",

        question:
            "Do you often misplace everyday objects such as keys, glasses, or a phone?",

        translations: {
            "hi-IN":
                "क्या आप अक्सर चाबी, चश्मा या फोन जैसी रोज़मर्रा की चीज़ें कहीं रखकर भूल जाते हैं?",

            "as-IN":
                "আপুনি চাবি, চশমা বা ফোনৰ দৰে দৈনন্দিন বস্তু প্ৰায়ে ক'ত থৈছে পাহৰি যায় নেকি?",

            "bn-IN":
                "আপনি কি প্রায়ই চাবি, চশমা বা ফোনের মতো দৈনন্দিন জিনিস কোথায় রেখেছেন তা ভুলে যান?"
        }
    },


    {
        category: "Memory",

        question:
            "Do you need reminders for appointments, events, or plans?",

        translations: {
            "hi-IN":
                "क्या आपको अपॉइंटमेंट, कार्यक्रम या योजनाओं के लिए याद दिलाने की आवश्यकता होती है?",

            "as-IN":
                "আপোনাৰ সাক্ষাৎ, অনুষ্ঠান বা পৰিকল্পনাৰ বাবে সোঁৱৰাই দিয়াৰ প্ৰয়োজন হয় নেকি?",

            "bn-IN":
                "আপনার কি অ্যাপয়েন্টমেন্ট, অনুষ্ঠান বা পরিকল্পনার জন্য মনে করিয়ে দেওয়ার প্রয়োজন হয়?"
        }
    },


    {
        category: "Orientation",

        question:
            "Do you sometimes become confused about the date, day, month, or time?",

        translations: {
            "hi-IN":
                "क्या आपको कभी तारीख, दिन, महीने या समय के बारे में भ्रम होता है?",

            "as-IN":
                "আপুনি কেতিয়াবা তাৰিখ, দিন, মাহ বা সময়ৰ বিষয়ে বিভ্ৰান্ত হয় নেকি?",

            "bn-IN":
                "আপনি কি কখনও তারিখ, দিন, মাস বা সময় সম্পর্কে বিভ্রান্ত হন?"
        }
    },


    {
        category: "Orientation",

        question:
            "Do you sometimes become confused about where you are or how you got to a familiar place?",

        translations: {
            "hi-IN":
                "क्या आपको कभी यह समझने में भ्रम होता है कि आप कहाँ हैं या किसी परिचित जगह पर कैसे पहुँचे?",

            "as-IN":
                "আপুনি কেতিয়াবা আপুনি ক'ত আছে বা চিনাকি ঠাইলৈ কেনেকৈ আহিল সেই বিষয়ে বিভ্ৰান্ত হয় নেকি?",

            "bn-IN":
                "আপনি কি কখনও কোথায় আছেন বা কীভাবে কোনো পরিচিত জায়গায় পৌঁছেছেন তা নিয়ে বিভ্রান্ত হন?"
        }
    },


    {
        category: "Communication",

        question:
            "Do you have difficulty finding the right words when speaking?",

        translations: {
            "hi-IN":
                "क्या आपको बोलते समय सही शब्द खोजने में कठिनाई होती है?",

            "as-IN":
                "কথা কওঁতে সঠিক শব্দ বিচাৰি উলিয়াবলৈ আপোনাৰ অসুবিধা হয় নেকি?",

            "bn-IN":
                "আপনার কি কথা বলার সময় সঠিক শব্দ খুঁজে পেতে অসুবিধা হয়?"
        }
    },


    {
        category: "Communication",

        question:
            "Do you sometimes lose track of conversations while talking with someone?",

        translations: {
            "hi-IN":
                "क्या किसी से बात करते समय आप कभी बातचीतের বিষয় হারিয়ে ফেলেন?",

            "as-IN":
                "কাৰোবাৰ সৈতে কথা পাতোঁতে আপুনি কেতিয়াবা কথোপকথনৰ ধাৰা হেৰুৱাই পেলায় নেকি?",

            "bn-IN":
                "কারও সঙ্গে কথা বলার সময় আপনি কি কখনও কথোপকথনের বিষয় হারিয়ে ফেলেন?"
        }
    },


    {
        category: "Everyday Activities",

        question:
            "Do you have difficulty completing familiar daily activities that you used to manage easily?",

        translations: {
            "hi-IN":
                "क्या आपको उन परिचित दैनिक कार्यों को पूरा करने में कठिनाई होती है जिन्हें आप पहले आसानी से कर लेते थे?",

            "as-IN":
                "আগতে সহজে কৰা চিনাকি দৈনন্দিন কামবোৰ সম্পূৰ্ণ কৰাত আপোনাৰ অসুবিধা হয় নেকি?",

            "bn-IN":
                "আপনার কি পরিচিত দৈনন্দিন কাজ সম্পন্ন করতে অসুবিধা হয়, যেগুলো আপনি আগে সহজেই করতে পারতেন?"
        }
    },


    {
        category: "Everyday Activities",

        question:
            "Do you need more help than before with money, medicines, cooking, or appointments?",

        translations: {
            "hi-IN":
                "क्या आपको पहले की तुलना में पैसे, दवाइयों, खाना बनाने या अपॉइंटमेंट के लिए अधिक मदद की आवश्यकता होती है?",

            "as-IN":
                "আগৰ তুলনাত টকা-পইচা, ঔষধ, ৰন্ধন বা সাক্ষাৎৰ ক্ষেত্ৰত আপোনাক অধিক সহায়ৰ প্ৰয়োজন হয় নেকি?",

            "bn-IN":
                "আগের তুলনায় টাকা-পয়সা, ওষুধ, রান্না বা অ্যাপয়েন্টমেন্টের জন্য আপনার কি বেশি সাহায্যের প্রয়োজন হয়?"
        }
    },


    {
        category: "Problem Solving",

        question:
            "Do you have difficulty planning, organizing, or solving familiar everyday problems?",

        translations: {
            "hi-IN":
                "क्या आपको परिचित रोज़मर्रा की समस्याओं की योजना बनाने, व्यवस्थित करने या हल करने में कठिनाई होती है?",

            "as-IN":
                "চিনাকি দৈনন্দিন সমস্যাৰ পৰিকল্পনা, সংগঠন বা সমাধান কৰাত আপোনাৰ অসুবিধা হয় নেকি?",

            "bn-IN":
                "আপনার কি পরিচিত দৈনন্দিন সমস্যার পরিকল্পনা করা, সংগঠিত করা বা সমাধান করতে অসুবিধা হয়?"
        }
    },


    {
        category: "Recognition",

        question:
            "Do you have difficulty recognizing familiar people, places, or everyday objects?",

        translations: {
            "hi-IN":
                "क्या आपको परिचित लोगों, स्थानों या रोज़मर्रा की वस्तुओं को पहचानने में कठिनाई होती है?",

            "as-IN":
                "চিনাকি মানুহ, ঠাই বা দৈনন্দিন বস্তু চিনাক্ত কৰাত আপোনাৰ অসুবিধা হয় নেকি?",

            "bn-IN":
                "আপনার কি পরিচিত মানুষ, স্থান বা দৈনন্দিন জিনিস চিনতে অসুবিধা হয়?"
        }
    },


    {
        category: "Behaviour & Mood",

        question:
            "Have you noticed significant changes in your mood, behaviour, interests, or social interaction?",

        translations: {
            "hi-IN":
                "क्या आपने अपने मूड, व्यवहार, रुचियों या सामाजिक संपर्क में महत्वपूर्ण बदलाव देखे हैं?",

            "as-IN":
                "আপুনি আপোনাৰ মনোভাৱ, আচৰণ, আগ্ৰহ বা সামাজিক যোগাযোগত উল্লেখযোগ্য পৰিৱৰ্তন লক্ষ্য কৰিছেনে?",

            "bn-IN":
                "আপনি কি আপনার মেজাজ, আচরণ, আগ্রহ বা সামাজিক যোগাযোগে উল্লেখযোগ্য পরিবর্তন লক্ষ্য করেছেন?"
        }
    }

];


// ============================================================
// ANSWER VALUES
// ============================================================

const answerValues = [0, 1, 2, 3];


// ============================================================
// PAGE ELEMENTS
// ============================================================

let startButton;
let introCard;
let chatCard;
let resultCard;

let chatArea;
let progressText;
let progressPercent;
let progressFill;

let answerButtons;
let nextButton;

let resultIcon;
let resultTitle;
let resultScore;
let resultMessage;
let categoryList;
let recommendationText;

let restartButton;

let speakQuestionBtn;
let speakAnswerBtn;
let voiceStatus;

let languageSelect;


// ============================================================
// CURRENT LANGUAGE
// ============================================================

function getCurrentLanguage() {

    if (
        typeof CogniCareVoice !==
        "undefined"
    ) {

        return CogniCareVoice.getLanguage();

    }

    return "en-IN";

}


function getLanguageData() {

    const language =
        getCurrentLanguage();


    return (
        SCREENING_LANGUAGES[language] ||
        SCREENING_LANGUAGES["en-IN"]
    );

}


// ============================================================
// GET TRANSLATED QUESTION
// ============================================================

function getQuestionText(symptom) {

    const language =
        getCurrentLanguage();


    if (
        language === "en-IN"
    ) {

        return symptom.question;

    }


    return (
        symptom.translations[language] ||
        symptom.question
    );

}


// ============================================================
// CATEGORY TRANSLATION
// ============================================================

function getCategoryText(category) {

    const language =
        getCurrentLanguage();


    const translations = {

        "hi-IN": {

            "Memory": "स्मृति",

            "Orientation": "समय और स्थान की समझ",

            "Communication": "बातचीत",

            "Everyday Activities": "दैनिक गतिविधियाँ",

            "Problem Solving": "समस्या समाधान",

            "Recognition": "पहचान",

            "Behaviour & Mood": "व्यवहार और मनोदशा"

        },


        "as-IN": {

            "Memory": "স্মৃতি",

            "Orientation": "সময় আৰু স্থানৰ বোধ",

            "Communication": "যোগাযোগ",

            "Everyday Activities": "দৈনন্দিন কাম-কাজ",

            "Problem Solving": "সমস্যা সমাধান",

            "Recognition": "চিনাক্তকৰণ",

            "Behaviour & Mood": "আচৰণ আৰু মনোভাৱ"

        },


        "bn-IN": {

            "Memory": "স্মৃতি",

            "Orientation": "সময় ও স্থান সম্পর্কে বোঝাপড়া",

            "Communication": "যোগাযোগ",

            "Everyday Activities": "দৈনন্দিন কাজ",

            "Problem Solving": "সমস্যা সমাধান",

            "Recognition": "চেনা ও শনাক্তকরণ",

            "Behaviour & Mood": "আচরণ ও মেজাজ"

        }

    };


    if (
        language === "en-IN"
    ) {

        return category;

    }


    return (
        translations[language] &&
        translations[language][category]
    ) || category;

}


// ============================================================
// UPDATE STATIC UI LANGUAGE
// ============================================================

function updateLanguageUI() {

    const lang =
        getLanguageData();


    // --------------------------------------------------------
    // INTRO
    // --------------------------------------------------------

    const introTitle =
        document.querySelector(
            "#introCard h2"
        );


    if (introTitle) {

        introTitle.textContent =
            lang.introTitle;

    }


    const introParagraphs =
        document.querySelectorAll(
            "#introCard > p"
        );


    if (
        introParagraphs.length >= 2
    ) {

        introParagraphs[0].textContent =
            lang.intro1;

        introParagraphs[1].textContent =
            lang.intro2;

    }


    // --------------------------------------------------------
    // INFO BOX
    // --------------------------------------------------------

    const infoBox =
        document.querySelector(
            "#introCard .info-box"
        );


    if (infoBox) {

        infoBox.innerHTML = `

            <strong>
                ${lang.howItWorks}
            </strong>

            <br><br>

            ${lang.howItWorksText}

            <br><br>

            <strong>
                ${lang.frequency}
            </strong>

            <br><br>

            ${lang.voiceInstruction}

        `;

    }


    // --------------------------------------------------------
    // WARNING
    // --------------------------------------------------------

    const warningBox =
        document.querySelector(
            "#introCard .warning-box"
        );


    if (warningBox) {

        warningBox.innerHTML = `

            <strong>
                ${lang.important}
            </strong>

            <br>

            ${lang.screeningWarning}

            <br><br>

            ${lang.professional}

        `;

    }


    // --------------------------------------------------------
    // START BUTTON
    // --------------------------------------------------------

    if (startButton) {

        startButton.textContent =
            lang.start;

    }


    // --------------------------------------------------------
    // ANSWER TITLE
    // --------------------------------------------------------

    const answerTitle =
        document.querySelector(
            ".answer-title"
        );


    if (answerTitle) {

        answerTitle.textContent =
            lang.answerQuestion;

    }


    // --------------------------------------------------------
    // VOICE BUTTONS
    // --------------------------------------------------------

    if (speakQuestionBtn) {

        speakQuestionBtn.textContent =
            lang.hearQuestion;

    }


    if (speakAnswerBtn) {

        speakAnswerBtn.textContent =
            lang.speakAnswer;

    }


    // --------------------------------------------------------
    // NEXT BUTTON
    // --------------------------------------------------------

    if (nextButton) {

        nextButton.textContent =
            lang.next;

    }


    // --------------------------------------------------------
    // RESTART
    // --------------------------------------------------------

    if (restartButton) {

        restartButton.textContent =
            lang.takeAgain;

    }


    // --------------------------------------------------------
    // RESULT SECTION
    // --------------------------------------------------------

    const categoryHeading =
        document.querySelector(
            "#categoryResults h3"
        );


    if (categoryHeading) {

        categoryHeading.textContent =
            lang.symptomProfile;

    }


    const recommendationHeading =
        document.querySelector(
            ".recommendation strong"
        );


    if (recommendationHeading) {

        recommendationHeading.textContent =
            lang.recommendation;

    }


    // --------------------------------------------------------
    // MEDICAL NOTE
    // --------------------------------------------------------

    const medicalNote =
        document.querySelector(
            ".medical-note"
        );


    if (medicalNote) {

        medicalNote.innerHTML = `

            ⚠️

            <strong>
                ${lang.medicalImportant}
            </strong>

            ${lang.medicalNote}

        `;

    }


    // --------------------------------------------------------
    // ANSWER BUTTONS
    // --------------------------------------------------------

    updateAnswerButtons();


    // --------------------------------------------------------
    // CURRENT QUESTION
    // --------------------------------------------------------

    if (
        chatCard &&
        chatCard.style.display === "block" &&
        symptoms[currentQuestion]
    ) {

        showQuestion(
            false
        );

    }


    // --------------------------------------------------------
    // CURRENT RESULT
    // --------------------------------------------------------

    if (
        resultCard &&
        resultCard.style.display === "block" &&
        answers.length === symptoms.length
    ) {

        showResult();

    }


    // --------------------------------------------------------
    // VOICE STATUS
    // --------------------------------------------------------

    if (
        voiceStatus &&
        chatCard &&
        chatCard.style.display === "block"
    ) {

        voiceStatus.textContent =
            lang.voiceStatus;

    }

}


// ============================================================
// UPDATE ANSWER BUTTON LABELS
// ============================================================

function updateAnswerButtons() {

    if (!answerButtons) {

        return;

    }


    const labels = {

        "en-IN": [
            "Never",
            "Sometimes",
            "Often",
            "Frequently"
        ],

        "hi-IN": [
            "कभी नहीं",
            "कभी-कभी",
            "अक्सर",
            "बहुत बार"
        ],

        "as-IN": [
            "কেতিয়াও নহয়",
            "কেতিয়াবা",
            "প্ৰায়ে",
            "সঘনাই"
        ],

        "bn-IN": [
            "কখনও নয়",
            "মাঝে মাঝে",
            "প্রায়ই",
            "ঘন ঘন"
        ]

    };


    const currentLabels =
        labels[getCurrentLanguage()] ||
        labels["en-IN"];


    answerButtons.forEach(
        function(
            button,
            index
        ) {

            button.textContent =
                currentLabels[index];

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        startButton =
            document.getElementById(
                "startButton"
            );


        introCard =
            document.getElementById(
                "introCard"
            );


        chatCard =
            document.getElementById(
                "chatCard"
            );


        resultCard =
            document.getElementById(
                "resultCard"
            );


        chatArea =
            document.getElementById(
                "chatArea"
            );


        progressText =
            document.getElementById(
                "progressText"
            );


        progressPercent =
            document.getElementById(
                "progressPercent"
            );


        progressFill =
            document.getElementById(
                "progressFill"
            );


        answerButtons =
            document.querySelectorAll(
                ".answer-button"
            );


        nextButton =
            document.getElementById(
                "nextButton"
            );


        resultIcon =
            document.getElementById(
                "resultIcon"
            );


        resultTitle =
            document.getElementById(
                "resultTitle"
            );


        resultScore =
            document.getElementById(
                "resultScore"
            );


        resultMessage =
            document.getElementById(
                "resultMessage"
            );


        categoryList =
            document.getElementById(
                "categoryList"
            );


        recommendationText =
            document.getElementById(
                "recommendationText"
            );


        restartButton =
            document.getElementById(
                "restartButton"
            );


        speakQuestionBtn =
            document.getElementById(
                "speakQuestionBtn"
            );


        speakAnswerBtn =
            document.getElementById(
                "speakAnswerBtn"
            );


        voiceStatus =
            document.getElementById(
                "voiceStatus"
            );


        languageSelect =
            document.getElementById(
                "languageSelect"
            );


        // ----------------------------------------------------
        // LANGUAGE SELECTOR
        // ----------------------------------------------------

        if (languageSelect) {


            const savedLanguage =
                getCurrentLanguage();


            languageSelect.value =
                savedLanguage;


            languageSelect.addEventListener(
                "change",
                function() {


                    const selectedLanguage =
                        this.value;


                    if (
                        typeof CogniCareVoice !==
                        "undefined"
                    ) {

                        CogniCareVoice.setLanguage(
                            selectedLanguage
                        );

                    }


                    updateLanguageUI();


                    // Stop any current speech

                    if (
                        typeof CogniCareVoice !==
                        "undefined"
                    ) {

                        CogniCareVoice.stop();

                    }


                    // Speak newly translated question

                    if (
                        chatCard &&
                        chatCard.style.display ===
                            "block" &&
                        symptoms[currentQuestion]
                    ) {

                        setTimeout(
                            function() {

                                speakCurrentQuestion();

                            },
                            400
                        );

                    }

                }
            );

        }


        // ----------------------------------------------------
        // INITIAL LANGUAGE
        // ----------------------------------------------------

        updateLanguageUI();


        // ----------------------------------------------------
        // START
        // ----------------------------------------------------

        if (startButton) {

            startButton.addEventListener(
                "click",
                startScreening
            );

        }


        // ----------------------------------------------------
        // ANSWERS
        // ----------------------------------------------------

        answerButtons.forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        selectAnswer(
                            button
                        );

                    }
                );

            }
        );


        // ----------------------------------------------------
        // NEXT
        // ----------------------------------------------------

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                nextQuestion
            );

        }


        // ----------------------------------------------------
        // RESTART
        // ----------------------------------------------------

        if (restartButton) {

            restartButton.addEventListener(
                "click",
                restartScreening
            );

        }


        // ----------------------------------------------------
        // HEAR QUESTION
        // ----------------------------------------------------

        if (speakQuestionBtn) {

            speakQuestionBtn.addEventListener(
                "click",
                speakCurrentQuestion
            );

        }


        // ----------------------------------------------------
        // SPEAK ANSWER
        // ----------------------------------------------------

        if (speakAnswerBtn) {

            speakAnswerBtn.addEventListener(
                "click",
                startVoiceAnswer
            );

        }

    }
);


// ============================================================
// START SCREENING
// ============================================================

function startScreening() {

    currentQuestion = 0;

    answers = [];


    introCard.style.display =
        "none";


    chatCard.style.display =
        "block";


    resultCard.style.display =
        "none";


    showQuestion();

}


// ============================================================
// SHOW QUESTION
// ============================================================

function showQuestion(
    autoSpeak = true
) {

    const symptom =
        symptoms[currentQuestion];


    if (!symptom) {

        return;

    }


    const lang =
        getLanguageData();


    // --------------------------------------------------------
    // CLEAR CHAT
    // --------------------------------------------------------

    chatArea.innerHTML =
        "";


    // --------------------------------------------------------
    // BOT MESSAGE
    // --------------------------------------------------------

    const message =
        document.createElement(
            "div"
        );


    message.className =
        "bot-message";


    message.innerHTML = `

        <div class="bot-name">

            🧠 CogniCare Assistant

        </div>


        <div class="question-category">

            ${getCategoryText(
                symptom.category
            )}

        </div>


        <div>

            ${getQuestionText(
                symptom
            )}

        </div>

    `;


    chatArea.appendChild(
        message
    );


    // --------------------------------------------------------
    // RESET ANSWERS
    // --------------------------------------------------------

    answerButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    // --------------------------------------------------------
    // RESTORE CURRENT ANSWER
    // --------------------------------------------------------

    if (
        answers[currentQuestion] !==
        undefined
    ) {

        answerButtons.forEach(
            function(button) {

                if (
                    Number(
                        button.dataset.value
                    ) ===
                    answers[currentQuestion]
                ) {

                    button.classList.add(
                        "selected"
                    );

                }

            }
        );

    }


    // --------------------------------------------------------
    // NEXT BUTTON
    // --------------------------------------------------------

    nextButton.disabled =
        answers[currentQuestion] ===
        undefined;


    // --------------------------------------------------------
    // PROGRESS
    // --------------------------------------------------------

    updateProgress();


    // --------------------------------------------------------
    // VOICE STATUS
    // --------------------------------------------------------

    if (voiceStatus) {

        voiceStatus.textContent =
            lang.voiceStatus;

    }


    // --------------------------------------------------------
    // AUTO SPEAK
    // --------------------------------------------------------

    if (autoSpeak) {

        setTimeout(
            function() {

                speakCurrentQuestion();

            },
            500
        );

    }

}


// ============================================================
// UPDATE PROGRESS
// ============================================================

function updateProgress() {

    const total =
        symptoms.length;


    const number =
        currentQuestion + 1;


    const percent =
        Math.round(
            (number / total) * 100
        );


    const language =
        getCurrentLanguage();


    const progressLabels = {

        "en-IN":
            `Symptom ${number} of ${total}`,

        "hi-IN":
            `लक्षण ${number} में से ${total}`,

        "as-IN":
            `লক্ষণ ${number} / ${total}`,

        "bn-IN":
            `উপসর্গ ${number} / ${total}`

    };


    progressText.textContent =
        progressLabels[language] ||
        progressLabels["en-IN"];


    progressPercent.textContent =
        `${percent}%`;


    progressFill.style.width =
        `${percent}%`;

}


// ============================================================
// SELECT ANSWER
// ============================================================

function selectAnswer(
    button
) {


    answerButtons.forEach(
        function(btn) {

            btn.classList.remove(
                "selected"
            );

        }
    );


    button.classList.add(
        "selected"
    );


    const value =
        Number(
            button.dataset.value
        );


    answers[currentQuestion] =
        value;


    nextButton.disabled =
        false;


    if (voiceStatus) {

        const labels = {

            "en-IN": [
                "Never",
                "Sometimes",
                "Often",
                "Frequently"
            ],

            "hi-IN": [
                "कभी नहीं",
                "कभी-कभी",
                "अक्सर",
                "बहुत बार"
            ],

            "as-IN": [
                "কেতিয়াও নহয়",
                "কেতিয়াবা",
                "প্ৰায়ে",
                "সঘনাই"
            ],

            "bn-IN": [
                "কখনও নয়",
                "মাঝে মাঝে",
                "প্রায়ই",
                "ঘন ঘন"
            ]

        };


        const currentLabels =
            labels[getCurrentLanguage()] ||
            labels["en-IN"];


        voiceStatus.textContent =
            `${getLanguageData().selected} ${currentLabels[value]}`;

    }

}


// ============================================================
// NEXT QUESTION
// ============================================================

function nextQuestion() {

    if (
        answers[currentQuestion] ===
        undefined
    ) {

        return;

    }


    currentQuestion++;


    if (
        currentQuestion >=
        symptoms.length
    ) {

        showResult();

        return;

    }


    showQuestion();

}


// ============================================================
// SPEAK CURRENT QUESTION
// ============================================================

function speakCurrentQuestion() {

    if (
        typeof CogniCareVoice ===
        "undefined"
    ) {

        if (voiceStatus) {

            voiceStatus.textContent =
                "Voice assistance is unavailable.";

        }

        return;

    }


    const symptom =
        symptoms[currentQuestion];


    if (!symptom) {

        return;

    }


    const question =
        getQuestionText(
            symptom
        );


    CogniCareVoice.speak(
        question
    );


    if (voiceStatus) {

        voiceStatus.textContent =
            getLanguageData().reading;

    }

}


// ============================================================
// START VOICE ANSWER
// ============================================================

function startVoiceAnswer() {

    if (
        typeof CogniCareVoice ===
        "undefined"
    ) {

        if (voiceStatus) {

            voiceStatus.textContent =
                "Voice assistance is unavailable.";

        }

        return;

    }


    const lang =
        getLanguageData();


    if (voiceStatus) {

        voiceStatus.textContent =
            lang.listening;

    }


    CogniCareVoice.startListening(

        // ----------------------------------------------------
        // RESULT
        // ----------------------------------------------------

        function(transcript) {


            console.log(
                "Voice transcript:",
                transcript
            );


            const answer =
                transcript
                    .toLowerCase()
                    .trim();


            const selected =
                detectAnswer(
                    answer
                );


            // ------------------------------------------------
            // NOT UNDERSTOOD
            // ------------------------------------------------

            if (
                selected ===
                null
            ) {


                if (voiceStatus) {

                    voiceStatus.textContent =
                        lang.notUnderstood;

                }


                CogniCareVoice.speak(
                    lang.sorryNotUnderstood
                );


                return;

            }


            // ------------------------------------------------
            // SELECT ANSWER
            // ------------------------------------------------

            answerButtons.forEach(
                function(button) {

                    const value =
                        Number(
                            button.dataset.value
                        );


                    if (
                        value ===
                        selected
                    ) {

                        button.click();

                    }

                }
            );


            // ------------------------------------------------
            // CONFIRM
            // ------------------------------------------------

            const labels = {

                "en-IN": [
                    "Never",
                    "Sometimes",
                    "Often",
                    "Frequently"
                ],

                "hi-IN": [
                    "कभी नहीं",
                    "कभी-कभी",
                    "अक्सर",
                    "बहुत बार"
                ],

                "as-IN": [
                    "কেতিয়াও নহয়",
                    "কেতিয়াবা",
                    "প্ৰায়ে",
                    "সঘনাই"
                ],

                "bn-IN": [
                    "কখনও নয়",
                    "মাঝে মাঝে",
                    "প্রায়ই",
                    "ঘন ঘন"
                ]

            };


            const currentLabels =
                labels[getCurrentLanguage()] ||
                labels["en-IN"];


            const selectedText =
                currentLabels[selected];


            if (voiceStatus) {

                voiceStatus.textContent =
                    `${lang.heard} ${selectedText}`;

            }


            CogniCareVoice.speak(
                `${lang.selected} ${selectedText}.`
            );

        },


        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

        function(error) {

            console.error(
                "Voice recognition error:",
                error
            );


            if (voiceStatus) {

                voiceStatus.textContent =
                    "⚠️ Voice input could not be used. Please try again.";

            }

        },


        // ----------------------------------------------------
        // END
        // ----------------------------------------------------

        function() {

            console.log(
                "Voice recognition ended."
            );

        }

    );

}


// ============================================================
// DETECT SPOKEN ANSWER
// ============================================================

function detectAnswer(
    text
) {

    const language =
        getCurrentLanguage();


    // ========================================================
    // ENGLISH
    // ========================================================

    if (
        language === "en-IN"
    ) {

        if (
            text.includes("frequently") ||
            text.includes("very frequently")
        ) {

            return 3;

        }


        if (
            text.includes("sometimes") ||
            text.includes("some times")
        ) {

            return 1;

        }


        if (
            text.includes("often")
        ) {

            return 2;

        }


        if (
            text === "never" ||
            text.includes("never")
        ) {

            return 0;

        }

    }


    // ========================================================
    // HINDI
    // ========================================================

    if (
        language === "hi-IN"
    ) {

        // Frequently

        if (
            text.includes("बहुत बार") ||
            text.includes("बार बार") ||
            text.includes("बार-बार") ||
            text.includes("अक्सर बहुत")
        ) {

            return 3;

        }


        // Sometimes

        if (
            text.includes("कभी-कभी") ||
            text.includes("कभी कभी")
        ) {

            return 1;

        }


        // Often

        if (
            text.includes("अक्सर")
        ) {

            return 2;

        }


        // Never

        if (
            text.includes("कभी नहीं")
        ) {

            return 0;

        }

    }


    // ========================================================
    // ASSAMESE
    // ========================================================

    if (
        language === "as-IN"
    ) {

        // Frequently

        if (
            text.includes("সঘনাই")
        ) {

            return 3;

        }


        // Sometimes

        if (
            text.includes("কেতিয়াবা")
        ) {

            return 1;

        }


        // Often

        if (
            text.includes("প্ৰায়ে")
        ) {

            return 2;

        }


        // Never

        if (
            text.includes("কেতিয়াও নহয়")
        ) {

            return 0;

        }

    }


    // ========================================================
    // BENGALI
    // ========================================================

    if (
        language === "bn-IN"
    ) {

        // Frequently

        if (
            text.includes("ঘন ঘন") ||
            text.includes("ঘনঘন")
        ) {

            return 3;

        }


        // Sometimes

        if (
            text.includes("মাঝে মাঝে")
        ) {

            return 1;

        }


        // Often

        if (
            text.includes("প্রায়ই")
        ) {

            return 2;

        }


        // Never

        if (
            text.includes("কখনও নয়")
        ) {

            return 0;

        }

    }


    return null;

}


// ============================================================
// SHOW RESULT
// ============================================================

function showResult() {

    chatCard.style.display =
        "none";


    resultCard.style.display =
        "block";


    // ========================================================
    // SCORE
    // ========================================================

    const totalScore =
        answers.reduce(
            function(
                sum,
                value
            ) {

                return sum + value;

            },
            0
        );


    const maxScore =
        symptoms.length * 3;


    const percentage =
        Math.round(
            (totalScore / maxScore) *
            100
        );


    const lang =
        getLanguageData();


    resultScore.textContent =
        `${lang.score}: ${totalScore} / ${maxScore} (${percentage}%)`;


    let title;
    let icon;
    let message;
    let recommendation;


    // ========================================================
    // RESULT CATEGORY
    // ========================================================

    if (
        percentage <= 25
    ) {

        icon =
            "🟢";

        title =
            lang.fewTitle;

        message =
            lang.fewMessage;

        recommendation =
            lang.fewRecommendation;

    }


    else if (
        percentage <= 55
    ) {

        icon =
            "🟡";

        title =
            lang.someTitle;

        message =
            lang.someMessage;

        recommendation =
            lang.someRecommendation;

    }


    else {

        icon =
            "🔴";

        title =
            lang.severalTitle;

        message =
            lang.severalMessage;

        recommendation =
            lang.severalRecommendation;

    }


    // ========================================================
    // DISPLAY RESULT
    // ========================================================

    resultIcon.textContent =
        icon;


    resultTitle.textContent =
        title;


    resultMessage.textContent =
        message;


    recommendationText.textContent =
        recommendation;


    // ========================================================
    // CATEGORY PROFILE
    // ========================================================

    createCategoryResults();


    // ========================================================
    // SAVE TO POSTGRESQL
    // ========================================================

    saveScreeningResult(
        totalScore,
        maxScore,
        percentage,
        getEnglishResultCategory(
            percentage
        ),
        answers
    );

}


// ============================================================
// ENGLISH DATABASE CATEGORY
// ============================================================

function getEnglishResultCategory(
    percentage
) {

    if (
        percentage <= 25
    ) {

        return "Few Symptoms Reported";

    }


    if (
        percentage <= 55
    ) {

        return "Some Cognitive Symptoms Reported";

    }


    return "Several Symptoms Reported";

}


// ============================================================
// SAVE SCREENING RESULT
// ============================================================

async function saveScreeningResult(
    totalScore,
    maxScore,
    percentage,
    resultCategory,
    screeningAnswers
) {


    console.log(
        "Saving cognitive screening result..."
    );


    try {


        const response =
            await fetch(
                `${API_BASE_URL}/cognitive-screenings/`,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            user_id:
                                USER_ID,

                            score:
                                totalScore,

                            max_score:
                                maxScore,

                            percentage:
                                percentage,

                            result_category:
                                resultCategory,

                            answers:
                                screeningAnswers

                        })

                }
            );


        if (
            !response.ok
        ) {


            const errorData =
                await response
                    .json()
                    .catch(
                        function() {

                            return {};

                        }
                    );


            console.error(
                "Screening save failed:",
                errorData
            );


            showSaveStatus(
                false,
                getLanguageData().saveFailed
            );


            return;

        }


        const data =
            await response.json();


        console.log(
            "Screening saved successfully:",
            data
        );


        showSaveStatus(
            true,
            getLanguageData().saved
        );

    }


    catch (error) {


        console.error(
            "Error saving screening:",
            error
        );


        showSaveStatus(
            false,
            getLanguageData().serverFailed
        );

    }

}


// ============================================================
// SAVE STATUS
// ============================================================

function showSaveStatus(
    success,
    message
) {


    const oldStatus =
        document.getElementById(
            "screeningSaveStatus"
        );


    if (oldStatus) {

        oldStatus.remove();

    }


    const status =
        document.createElement(
            "div"
        );


    status.id =
        "screeningSaveStatus";


    status.style.marginTop =
        "15px";


    status.style.padding =
        "12px";


    status.style.borderRadius =
        "10px";


    status.style.fontWeight =
        "600";


    if (success) {

        status.textContent =
            `✅ ${message}`;

    }

    else {

        status.textContent =
            `⚠️ ${message}`;

    }


    if (
        recommendationText
    ) {

        recommendationText.parentNode.appendChild(
            status
        );

    }

    else if (
        resultCard
    ) {

        resultCard.appendChild(
            status
        );

    }

}


// ============================================================
// CATEGORY RESULTS
// ============================================================

function createCategoryResults() {

    categoryList.innerHTML =
        "";


    const categories = {};


    // --------------------------------------------------------
    // GROUP
    // --------------------------------------------------------

    symptoms.forEach(
        function(
            symptom,
            index
        ) {


            const category =
                symptom.category;


            if (
                !categories[category]
            ) {

                categories[category] = {

                    total:
                        0,

                    count:
                        0

                };

            }


            categories[category].total +=
                answers[index] || 0;


            categories[category].count++;

        }
    );


    // --------------------------------------------------------
    // DISPLAY
    // --------------------------------------------------------

    Object.keys(
        categories
    ).forEach(
        function(category) {


            const data =
                categories[category];


            const max =
                data.count * 3;


            const percentage =
                Math.round(
                    (data.total / max) *
                    100
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "category-item";


            item.innerHTML = `

                <div class="category-top">

                    <span>
                        ${getCategoryText(
                            category
                        )}
                    </span>

                    <span>
                        ${percentage}%
                    </span>

                </div>


                <div class="category-bar">

                    <div
                        class="category-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

            `;


            categoryList.appendChild(
                item
            );

        }
    );

}


// ============================================================
// RESTART SCREENING
// ============================================================

function restartScreening() {

    currentQuestion =
        0;


    answers =
        [];


    // --------------------------------------------------------
    // STOP VOICE
    // --------------------------------------------------------

    if (
        typeof CogniCareVoice !==
        "undefined"
    ) {

        CogniCareVoice.stop();

        CogniCareVoice.stopListening();

    }


    // --------------------------------------------------------
    // RESET SCREENS
    // --------------------------------------------------------

    resultCard.style.display =
        "none";


    chatCard.style.display =
        "none";


    introCard.style.display =
        "block";


    // --------------------------------------------------------
    // CLEAR CHAT
    // --------------------------------------------------------

    chatArea.innerHTML =
        "";


    // --------------------------------------------------------
    // PROGRESS
    // --------------------------------------------------------

    if (progressText) {

        updateProgress();

    }


    if (progressPercent) {

        progressPercent.textContent =
            "0%";

    }


    if (progressFill) {

        progressFill.style.width =
            "0%";

    }


    // --------------------------------------------------------
    // ANSWERS
    // --------------------------------------------------------

    answerButtons.forEach(
        function(button) {

            button.classList.remove(
                "selected"
            );

        }
    );


    // --------------------------------------------------------
    // NEXT
    // --------------------------------------------------------

    if (nextButton) {

        nextButton.disabled =
            true;

    }


    // --------------------------------------------------------
    // SAVE STATUS
    // --------------------------------------------------------

    const saveStatus =
        document.getElementById(
            "screeningSaveStatus"
        );


    if (saveStatus) {

        saveStatus.remove();

    }


    // --------------------------------------------------------
    // VOICE STATUS
    // --------------------------------------------------------

    if (voiceStatus) {

        voiceStatus.textContent =
            getLanguageData().voiceStatus;

    }


    // --------------------------------------------------------
    // UPDATE LANGUAGE
    // --------------------------------------------------------

    updateLanguageUI();

}
