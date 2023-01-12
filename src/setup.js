import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist'
import getPort, { portNumbers } from 'get-port';

const argv = minimist(process.argv.slice(2));
console.dir(argv);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let grafanaPort;
const serverPort = argv.serverPort || 21025;

function UpdateEnvFile() {
    const exampleEnvFilePath = join(__dirname, '../example.env');

    let exampleEnvText = fs.readFileSync(exampleEnvFilePath, 'utf8');
    exampleEnvText = exampleEnvText.replaceAll('{{ grafanaPort }}', grafanaPort).replaceAll('{{ serverPort }}', serverPort);
    const envFile = join(__dirname, '../.env');
    fs.writeFileSync(envFile, exampleEnvText);
    console.log('Env file created');
}

async function UpdateDockerComposeFile() {
    const exampleDockerComposeFile = join(__dirname, '../docker-compose.example.yml');

    let exampleDockerComposeText = fs.readFileSync(exampleDockerComposeFile, 'utf8');
    exampleDockerComposeText = exampleDockerComposeText.replaceAll('{{ grafanaPort }}', grafanaPort).replaceAll('{{ serverPort }}', serverPort);
    const dockerComposeFile = join(__dirname, '../docker-compose.yml');
    fs.writeFileSync(dockerComposeFile, exampleDockerComposeText);
    console.log('Docker-compose file created');
}

export default async function Setup() {
    grafanaPort = argv.grafanaPort || await getPort({ port: portNumbers(3000, 4000) })
    UpdateEnvFile();
    await UpdateDockerComposeFile()
}
