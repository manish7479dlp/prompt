const express = require("express")
const PORT = 3000;
const { getResponse } = require("./helper");
const Database = require("./database.json")
const cors = require("cors")
const { GoogleGenAI } = require('@google/genai');
require("dotenv").config()

const API_KEY = process.env.GEMINI_API_KEY

const app = express();
app.use(express.json())
app.use(cors())


const ai = new GoogleGenAI({
    apiKey: API_KEY,
});

async function callGemini(prompt) {
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text
    } catch (error) {
        console.error(error)
        return []
    }
}

app.get("/", (req, res) => {
    res.json("server is up..")
})

app.get("/chats", (req, res) => {
    try {
        //preparing data 
        const test = [];
        Database.forEach((data) => {
            test.push({ role: "user", message: data.prompt });
            test.push({ role: "assistant", message: data.response });
        });

        const respone = { status: "success", data: test }
        res.json(respone)
    } catch (error) {
        console.error(error)
        const respone = { status: "failed", data: null }
        res.json(respone)
    }
})

app.post("/chats", async (req, res) => {
    try {
        let prompt = null;
        try {
            prompt = req.body.prompt;
            if (!prompt) {
                res.json({ status: "failed", message: "prompt should have some value.." })
                return
            }
        } catch (error) {
            console.error(error)
            res.json({ status: "failed", message: "prompt field is required" })
            return
        }

        // const promptResponse = getResponse(prompt, Database);
        const promptResponse = await callGemini(prompt)
        const respone = { status: "success", data: { response: { "role": "assistant", message: promptResponse } } }

        const time = 1000;
        setTimeout(() => {
            res.json(respone)
        }, time)

    } catch (error) {
        console.error(error)
        const respone = { status: "failed", data: null }
        res.json(respone)
    }
})

app.post("/js/chats", async (req, res) => {
    try {
        let prompt = null;
        try {
            prompt = req.body.prompt;
            if (!prompt) {
                res.json({ status: "failed", message: "prompt should have some value.." })
                return
            }
        } catch (error) {
            console.error(error)
            res.json({ status: "failed", message: "prompt field is required" })
            return
        }

        const promptResponse = getResponse(prompt, Database);
        // const promptResponse = await callGemini(prompt)
        const respone = { status: "success", data: { response: { "role": "assistant", message: promptResponse } } }

        const time = 1000;
        setTimeout(() => {
            res.json(respone)
        }, time)

    } catch (error) {
        console.error(error)
        const respone = { status: "failed", data: null }
        res.json(respone)
    }
})

app.listen(PORT, () => {
    console.log("Port is running...");
})

