const express = require("express");
const QRCode = require("qrcode");
const { PassThrough } = require("stream");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

const app = express();
const port = 3000;
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "./sessions",
    }),
});

try {
    client.once("ready", () => {
        console.log("waweb Client is ready!");
    });
} catch (error) {
    console.log("waweb failed initialized");
}

client.on("message_create", (message) => {
    const commands = JSON.parse(fs.readFileSync("commands.json", "utf8"));

    if (message.body === "kata kata hari ini") {
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
            .then((res) =>
                client.sendMessage(message.from, res.choices[0].message.content)
            );
    }

    if (message.body.includes("!add")) {
        const newCommand = message.body.split("~")[1];
        fs.writeFileSync(
            "commands.json",
            JSON.stringify([
                ...commands,
                {
                    command: newCommand.split(":")[0],
                    response: newCommand.split(":")[1],
                    description: newCommand.split(":")[2],
                    type: newCommand.split(":")[3],
                },
            ])
        );
        client.sendMessage(
            message.from,
            "Command berhasil ditambahkan\nCek !commands untuk melihat semua command"
        );
    }

    if (message.body.includes("!delete")) {
        const commandToDelete = message.body.split("~")[1];
        const newCommands = commands.filter(
            (c) => c.command !== commandToDelete
        );
        if (newCommands.length === commands.length) {
            client.sendMessage(
                message.from,
                "Command tidak ditemukan\nCek !commands untuk melihat semua command"
            );
        } else {
            fs.writeFileSync("commands.json", JSON.stringify(newCommands));
            client.sendMessage(
                message.from,
                "Command berhasil dihapus\nCek !commands untuk melihat semua command"
            );
        }
    }

    if (message.body.includes("!update")) {
        const updatedCommand = message.body.split("~")[1];
        const newCommand = commands.filter(
            (c) => c.command === updatedCommand.split(":")[0]
        );

        if (newCommand.length === 0) {
            console.log("000000");
            fs.writeFileSync(
                "commands.json",
                JSON.stringify([
                    ...commands,
                    {
                        command: updatedCommand.split(":")[0],
                        response: updatedCommand.split(":")[1],
                        description: updatedCommand.split(":")[2],
                        type: updatedCommand.split(":")[3],
                    },
                ])
            );
            client.sendMessage(
                message.from,
                "Command tidak ditemukan dan ditambahkan sebagai command baru\nCek !commands untuk melihat semua command"
            );
        } else {
            const newCommands = commands.map((c) => {
                if (c.command === updatedCommand.split(":")[0]) {
                    return {
                        command: updatedCommand.split(":")[0],
                        response: updatedCommand.split(":")[1],
                        description: updatedCommand.split(":")[2],
                        type: updatedCommand.split(":")[3],
                    };
                }
                return c;
            });
            fs.writeFileSync("commands.json", JSON.stringify(newCommands));
            client.sendMessage(
                message.from,
                "Command berhasil diupdate\nCek !commands untuk melihat semua command"
            );
        }
    }

    if (message.body === "!pap") {
        const pap = MessageMedia.fromFilePath("pap.jpg");
        client.sendMessage(message.from, pap);
    }

    if (message.body === "!papAlip") {
        const papAlip = MessageMedia.fromFilePath("papAlip.jpg");
        client.sendMessage(message.from, papAlip);
    }

    commands.map((c) => {
        if (message.body === c.command && c.command !== "!commands") {
            client.sendMessage(message.from, c.response);
        }
    });

    if (message.body === "!commands") {
        let msg = "Commands: \n";
        commands.map((c) => {
            msg += c.command + " : " + c.description + "\n";
        });
        client.sendMessage(message.from, msg);
    }
});

// When the client received QR-Code
app.get("/qr", async (req, res) => {
    client.on("qr", async (qr) => {
        try {
            const qrStream = new PassThrough();
            const result = await QRCode.toFileStream(qrStream, qr, {
                type: "png",
                width: 400,
                errorCorrectionLevel: "H",
            });

            qrStream.pipe(res);
        } catch (error) {
            res.send("QR Code Generate Failed");
        }
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/commands", (req, res) => {
    const commands = JSON.parse(fs.readFileSync("commands.json", "utf8"));

    res.json(commands);
});

client.initialize();

app.listen(port, () => {
    console.log("Service running on port 3000");
});
