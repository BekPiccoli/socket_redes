import net from "net";
import readline from "readline";

const port = 3001;
const localHost = "127.0.0.1";
const client = new net.Socket();
const RL = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.connect(port, localHost, () => {
  console.log("Você se conectou ao servidor!");
  RL.addListener("line", (line) => {
    client.write(line);
  });

  client.on("data", (data) => {
    console.log(data.toString());
  });
});
