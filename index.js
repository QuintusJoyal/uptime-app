const axios = require('axios');
const fs = require('fs');
const yargs = require('yargs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const argv = yargs
    .option('limit', {
        alias: 'l',
        description: 'Log limit (default: 10)',
        type: 'number',
        default: 10,
    })
    .option('input', {
        alias: 'i',
        description: 'Input file path (default: websites.json)',
        type: 'string',
        default: 'websites.json',
    })
    .option('output', {
        alias: 'o',
        description: 'Output folder path (default: logs)',
        type: 'string',
        default: 'logs',
    })
    .help()
    .alias('help', 'h')
    .argv;

const logsFolder = argv.output;

if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
}


const checkWebsiteStatus = async (url) => {
    try {
        const response = await axios.get(url);
        return response.status === 200 ? 'Online' : 'Offline';
    } catch (error) {
        return error.message;
    }
}

const getLogFileName = (siteName) => {
    return path.join(logsFolder, `${siteName}.log`);
}

const writeLog = (siteName, status) => {
    const logFileName = getLogFileName(siteName);
    const logEntry = `${new Date().toISOString()}: ${status}\n`;

    let logData = '';
    if (fs.existsSync(logFileName)) {
        logData = fs.readFileSync(logFileName, 'utf8');
    }

    logData = logEntry + logData;

    const logEntries = logData.split('\n').filter((entry) => entry.trim() !== '');
    if (logEntries.length > argv.limit) {
        logData = logEntries.slice(0, argv.limit).join('\n');
    }

    fs.writeFileSync(logFileName, logData);
}

const monitorStatus = async () => {
	let websites = await fs.promises.readFile(argv.input);
    for (const website of JSON.parse(websites)) {
        const status = await checkWebsiteStatus(website.url);
        writeLog(website.name, status);
    }
}

monitorStatus();

setInterval(monitorStatus, 60000);

app.use('/logs', express.static(logsFolder));

app.get('/', (req, res) => {
    fs.readdir(logsFolder, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const fileList = files.map((file) => {
                return `<li><a href="./logs/${file}">${file}</a></li>`;
            });

            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Status Logs</title>
            </head>
            <body>
                <h1>Status Logs:</h1>
                <ul>
                    ${fileList.join('\n')}
                </ul>
            </body>
            </html>`;

            res.send(html);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Uptime running on port ${PORT}`);
});
