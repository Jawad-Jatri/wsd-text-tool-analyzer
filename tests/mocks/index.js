module.exports.fakeText = "The quick brown fox jumps over the lazy dog. \nThe lazy dog slept in the sun.";
module.exports.fakeTexts = [
    {
        id: 1,
        text: 'Hello World',
    },
    {
        id: 2,
        text: "The quick brown fox jumps over the lazy dog. \nThe lazy dog slept in the sun.",
    }
];
module.exports.fakeTextAnalysisReport = {
    id: 1,
    text: "The quick brown fox jumps over the lazy dog. \nThe lazy dog slept in the sun.",
    wordCount: 16,
    characterCount: 76,
    sentenceCount: 2,
    paragraphCount: 2,
    longestWordsInParagraphs: [
        {
            paragraph: "The quick brown fox jumps over the lazy dog. ",
            longestWords: ["quick", "brown", "jumps"]
        },
        {
            paragraph: "The lazy dog slept in the sun.",
            longestWords: ["slept"]
        }
    ],
};
module.exports.fakeUser = {
    name: "John",
    email: "john@gmail.com",
    googleId: 10000000000000,
    status: true
};
