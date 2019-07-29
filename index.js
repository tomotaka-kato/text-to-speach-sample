// expressモジュールを読み込む
const express = require('express');
const path = require('path');
// expressアプリを生成する
const app = express();
//
// CORS を許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');  // ← コレを追加
  next();
});

/**
 * ブラウザ上で発話をさせる
 */
app.get('/', async (req, res) => {
    const subscriptionKey = process.env.SPEECH_SERVICE_KEY;
    if (!subscriptionKey) {
        throw new Error('Environment variable for your subscription key is not set.')
    };

    try {
        const accessToken = await getAccessToken(subscriptionKey);
        const text = req.query.text;
        console.log(text)
        await textToSpeech(accessToken, text);
        res.header('Content-Type', 'audio/wav')
        res.sendFile(path.join(__dirname, 'TTSOutput.wav'))
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
    }
})

/**
 * wavファイルとしてダウンロードをする
 */
app.get('/download', async (req, res) => {
    const subscriptionKey = process.env.SPEECH_SERVICE_KEY;
    if (!subscriptionKey) {
        throw new Error('Environment variable for your subscription key is not set.')
    };

    try {
        const accessToken = await getAccessToken(subscriptionKey);
        const text = req.query.text;
        console.log(text)
        await textToSpeech(accessToken, text);
        res.setHeader('Content-disposition', 'attachment; filename=sample.wav');
        res.header('Content-Type', 'audio/wav')
        res.sendFile(path.join(__dirname, 'TTSOutput.wav'))
    } catch (err) {
        console.log(`Something went wrong: ${err}`);
    }
})

// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');


// Gets an access token.
function getAccessToken(subscriptionKey) {
    let options = {
        method: 'POST',
        uri: 'https://japaneast.api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    }
    return rp(options);
}


// Make sure to update User-Agent with the name of your resource.
// You can also change the voice and output formats. See:
// https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
function textToSpeech(accessToken, text) {
    // Create the SSML request.
    let xml_body = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', 'ja-JP')
        .ele('voice')
        .att('xml:lang', 'ja-JP')
        .att('name', 'Microsoft Server Speech Text to Speech Voice (ja-JP, Ayumi, Apollo)')
        .txt(text)
        .end();
    // Convert the XML into a string to send in the TTS request.
    let body = xml_body.toString();
    let options = {
        method: 'POST',
        baseUrl: 'https://japaneast.tts.speech.microsoft.com/',
        url: 'cognitiveservices/v1',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'cloudservice-tkato',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
            'Content-Type': 'application/ssml+xml'
        },
        body: body
    }

    let request = rp(options) .on('response', (response) => {
            if (response.statusCode === 200) {
                request.pipe(fs.createWriteStream('TTSOutput.wav'));
            }
        });
    return request;
}


// ポート3000でサーバを立てる
app.listen(process.env.PORT || 8080, () => console.log('Listening on port 8080'));
