import qrcode from 'qrcode-terminal';
import { Client, WAState, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as fs from 'fs'

const wwebVersion = '2.2407.3';
const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
    puppeteer: {
        headless: false,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        // args: ['--disable-gpu', '--no-sandbox'],
    },
});

client.on('disconnected', (reason: string) => {
    console.log('Client was logged out', reason);
    client.initialize();
});


client.on('qr', (qr: string) => {
    qrcode.generate(qr, { small: true })
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', async () => {
    console.log('Client is auth!');

    console.log('Autenticado')
})

client.on('ready', async () => {
    console.log('Cliente pronto!');

    const obj = JSON.parse(fs.readFileSync('1.json', 'utf-8'));

    const usedNumbers = fs.readdirSync('./feitas/').flatMap((files) => {
        let obj = JSON.parse(fs.readFileSync('./feitas/' + files, 'utf-8'))
        return Object.entries(obj).map(value => value[1]);
    });

    const audioFilePath = 'audio1.opus'; // Caminho para o arquivo de áudio
    const audioFilePath2 = 'audio2.opus'; // Caminho para o arquivo de áudio

    // Cria uma instância de MessageMedia a partir do arquivo de áudio
    const audioMedia = MessageMedia.fromFilePath(audioFilePath);
    const audioMedia2 = MessageMedia.fromFilePath(audioFilePath2);

    obj.forEach((value:any, index:any) => {

        setTimeout(async () => {
            // Formata o número para o formato correto do WhatsApp
            const formattedNumber = `55${value}@c.us`;

            if (usedNumbers.indexOf(value) != -1) {
                return console.log('Esse número já foi usado', value);
            }

            // Enviar áudio
            await client.sendMessage(formattedNumber, audioMedia)
            setTimeout(async () => {
                await client.sendMessage(formattedNumber, audioMedia2)
                setTimeout(async () => {
                    await client.sendMessage(formattedNumber, "Sem compromisso, lógico!\nE se você não tiver interesse na unidade Belém, temos outras unidades pra você dar uma olhada.")
                    setTimeout(async () => {
                        await client.sendMessage(formattedNumber, "Também trabalhamos com o programa Minha Casa Minha Vida.")
                    }, 100);
                }, 100);
            }, 100);

        }, 10000 * index);

    });
});

client.initialize();
