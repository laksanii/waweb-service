fetch("https://api.aimlapi.com/chat/completions", {
    method: "POST",
    headers: {
        Authorization: "Bearer 21537dedcc6e4e4899f471bc00254a06",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content:
                    "you are a wise person and give me a wise words about love or life or career or anything in Indonesian.",
            },
            {
                role: "user",
                content: "berikan kata kata untuk hari ini",
            },
        ],
        max_tokens: 512,
        stream: false,
    }),
})
    .then((res) => res.json())
    .then((res) => console.log(res.choices[0].message.content));

// import OpenAI from 'openai';
// const OpenAI = require("openai");

// const openai = new OpenAI({
//     apiKey: "pk-YiAWlPffFbrIKuMPwbMLHlekVkKmnKYbwPZEQbpedyOBPOyC",
//     baseURL: "https://api.pawan.krd/v1",
// });

// const get = async () => {
//     const chatCompletion = await openai.chat.completions.create({
//         messages: [
//             {
//                 role: "user",
//                 content: "Berikan saya 1 kalimat kutipan dari kitab-kitab suci",
//             },
//         ],
//         model: "pai-001",
//     });
//     console.log(chatCompletion.choices[0].message.content);
// };

// get().then();

// const openai = new OpenAI({
//     apiKey: "pk-YiAWlPffFbrIKuMPwbMLHlekVkKmnKYbwPZEQbpedyOBPOy",
//     baseUrl: "https://api.pawan.krd/v1/chat/completions",
// });

// const get = async () => {
//     const completion = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//             {
//                 role: "user",
//                 content: "How do I list all files in a directory using Python?",
//             },
//         ],
//     });

//     console.log(completion.data.choices[0].message.content);
// };
