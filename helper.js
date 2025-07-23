function getResponse(prompt, DATA) {
    try {
        const promptWords = [...new Set(prompt.toLowerCase().split(/\s+/))]; // unique prompt words, lowercase
        let bestMatch = null;
        let bestScore = 0;

        for (const data of DATA) {
            const responseWord = new Set(data.prompt.toLowerCase().split(/\s+/));

            // Count how many prompt words appear in this message
            const commonWordsCount = promptWords.reduce((count, word) => responseWord.has(word) ? count + 1 : count, 0);
            // Track best match by common word count
            if (commonWordsCount > bestScore) {
                bestScore = commonWordsCount;
                bestMatch = data.response;
            }
        }

        // Define a minimum threshold for match (e.g., half the prompt words)
        // const threshold = Math.ceil(promptWords.length / 2);
        const threshold = Math.ceil(promptWords.length * 0.3);


        if (bestMatch && bestScore >= threshold) {
            return bestMatch;
        }

        return "Oops, no response found.";
    } catch (error) {
        console.error("Error in getResponse:", error);
        return "Oops, something went wrong.";
    }
}

module.exports = { getResponse };

"AIzaSyBq7tJjLpe_efTbTtDqJ52hN7QtBr2nkSU"
