import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function googleGenAI(userInput: string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `This is the user input: ${userInput}
        Analyze the user input to identify any medical symptoms they are experiencing.
        If symptoms are detected, suggest 3 possible medical conditions with:
        1. Condition name
        2. Short explanation
        3. Urgency level (low/medium/high)
        4. Common home care tips
        End the response by advising the user to consult the nearest doctor for a professional checkup.
        If the input does not relate to medical symptoms or health concerns, respond with:"I can only provide information related to health and medical symptoms.
        `,
    });
    return response
}
export default googleGenAI
