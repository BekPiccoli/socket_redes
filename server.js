import net from "net";
import fs from "fs";
import { exec } from "child_process";
const port = 3001;
const localHost = "127.0.0.1";

const handleConnection = (socket) => {
  console.log("Alguém se conectou!");
  socket.on("end", () => {
    console.log("Alguém se desconectou!");
  });
};

const commands = (socket) => {
  socket.on("data", (data) => {
    const message = data.toString().trim();
    switch (message) {
      case "/h":
        socket.write(
          "Comandos disponíveis: \n" +
            "date: Retorna a hora e data atual.\n" +
            "fs: Cria um arquivo txt no diretório atual.\n" +
            "end: Encerra a conexão.\n" +
            "neofetch: executa o comando neofetch no seu terminal se você tiver o mesmo instalado.\n"
        );
        break;

      case "date":
        const date = new Date().toString();
        socket.write("Data Atual: " + date + "\n");
        break;

      case "fs":
        const filePath = "TxtCriadoPeloServer.txt";
        const emoji = " 😎";
        if (fs.existsSync(filePath)) {
          const currentContent = fs.readFileSync(filePath, "utf8");
          fs.writeFileSync(filePath, currentContent + emoji);
          socket.write(`Emoji adicionado ao arquivo '${filePath}'.\n`);
        } else {
          fs.writeFileSync(filePath, "Bernardo Piccoli" + emoji);
          socket.write(`Arquivo '${filePath}' criado com emoji.\n`);
        }
        break;

      case "end":
        socket.write("Desconectando...\n");
        socket.end();
        break;

      case "neofetch":
        exec("neofetch", (error, stdout, stderr) => {
          if (error) {
            socket.write(`Erro ao executar o comando: ${error.message}\n`);
            return;
          }
          if (stderr) {
            socket.write(`Erro (stderr): ${stderr}\n`);
            return;
          }
          socket.write(stdout + "\n");
        });
        break;
      default:
        socket.write(
          "Comando não encontrado! Use /h para ver a paleta de comandos!\n"
        );
    }
  });
};

const server = net.createServer((socket) => {
  try {
    handleConnection(socket);
    commands(socket);
  } catch (error) {
    console.error(error);
  }
});

server.listen(port, localHost, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
