const fs = require("fs");

function handleRequest(req, res) {
  const currUrl = req.url;
  const method = req.method;

  if (currUrl == "/") {
    res.write("<html>");
    res.write("<head><title>Home</title></head>");
    res.write("<body>");
    res.write("<h1>Add a new user!</h1>");
    res.write(
      "<form method='POST' action='/create-user'><input type='text' name='username' /><button type='submit'>Adicionar</button></form>"
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (currUrl == "/users") {
    const usersList = fs.readFileSync("./newuser.txt", "utf8").split("\n");
    res.write("<html>");
    res.write("<head><title>Users</title></head>");
    res.write(
      `<body><ul>${usersList.map((user, index) => {
        if (index == usersList.length - 1) return;

        return `<li>${user.replaceAll("+", " ")}</li>`;
      })}</ul>`
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (currUrl == "/create-user" && method == "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const newUser = parsedBody.split("=")[1];

      fs.appendFile("newUser.txt", newUser + "\n", (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/users");

        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.end();
}

module.exports = handleRequest;
