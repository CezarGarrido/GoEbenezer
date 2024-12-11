const fs = require('fs');
const https = require('https');
const path = require('path');

// Lê a versão diretamente do package.json do pdfjs-dist
const pdfjsPackagePath = require.resolve('pdfjs-dist/package.json');
const pdfjsPackage = require(pdfjsPackagePath);
const PDFJS_VERSION = pdfjsPackage.version;

// URL do arquivo no pacote pdfjs-dist
const WORKER_URL = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
// Caminho de destino na pasta public
const DESTINATION_FOLDER = path.join(__dirname, './../public');
const DESTINATION_FILE = path.join(DESTINATION_FOLDER, 'pdf.worker.min.mjs');
const BASE64_FILE = path.join(DESTINATION_FOLDER, 'pdf.worker.min.mjs.base64');

// Função para baixar o arquivo
async function downloadPdfWorker() {
    // Verifica se a pasta public existe; caso contrário, cria
    if (!fs.existsSync(DESTINATION_FOLDER)) {
        fs.mkdirSync(DESTINATION_FOLDER, { recursive: true });
        console.log(`Pasta criada: ${DESTINATION_FOLDER}`);
    }

    // Baixa o arquivo e salva na pasta public
    const file = fs.createWriteStream(DESTINATION_FILE);
    https.get(WORKER_URL, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Arquivo baixado com sucesso: ${DESTINATION_FILE}`);
                convertToBase64(DESTINATION_FILE, BASE64_FILE);
            });
        } else {
            console.error(`Erro ao baixar o arquivo: ${response.statusCode}`);
        }
    }).on('error', (err) => {
        if (fs.existsSync(DESTINATION_FILE)) {
            fs.unlinkSync(DESTINATION_FILE); // Remove o arquivo em caso de erro
        }
        console.error(`Erro ao baixar o arquivo: ${err.message}`);
    });
}

// Função para converter o arquivo em Base64
function convertToBase64(sourceFile, outputFile) {
    try {
        const fileContent = fs.readFileSync(sourceFile, 'utf8');
        const base64Content = Buffer.from(fileContent).toString('base64');
        fs.writeFileSync(outputFile, base64Content);
        console.log(`Arquivo convertido para Base64: ${outputFile}`);
    } catch (err) {
        console.error(`Erro ao converter o arquivo para Base64: ${err.message}`);
    }
}

// Executa a função
downloadPdfWorker();