const express = require("express");
const app = express();
const client = require('./db')

app.use("/assets", express.static("assets"));
app.use(express.urlencoded({urlencoded: false}));

app.get("/", (req, res, next) => {
  res.send(`
        <html>
            <head>
                <title>The Acme Threatre Group</title>
                <link rel='stylesheet' href='/assets/styles.css'/>
            </head>
            <body>
                <h1>The Acme Threatre Group</h1>
                <nav>
                    <a href='/' class='selected'>Home</a>
                    <a href='/members'>Members</a>
                    <a href='/props'>Props</a>
                </nav>
            </body>
        </html>
    `);
});

app.use('/members', require('./routes/members'));

app.get("/props", async (req, res, next) => {
  try {
    const response = await client.query("SELECT * FROM props;");
    const props = response.rows;
    res.send(`
        <html>
            <head>
                <title>The Acme Threatre Group</title>
                <link rel='stylesheet' href='/assets/styles.css'/>
            </head>
            <body>
                <h1>The Acme Threatre Group</h1>
                <nav>
                    <a href='/'>Home</a>
                    <a href='/members' class='selected'>Members</a>
                    <a href='/props'>Props</a>
                </nav>
                <ul>
                    ${props
                      .map(
                        (prop) => `
                        <li>${prop.name}</li>
                    `
                      )
                      .join("")}
                </ul>
            </body>
        </html>
      `);
  } catch (error) {
    next(error);
  }
});

const setup = async () => {
  try {
    const SQL = `
        DROP TABLE IF EXISTS members;
        DROP TABLE IF EXISTS props;
        CREATE TABLE members(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        CREATE TABLE props(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        INSERT INTO members(name) VALUES('Moe');
        INSERT INTO members(name) VALUES('Larry');
        INSERT INTO members(name) VALUES('Lucy');
        INSERT INTO members(name) VALUES('Ethyl');
        INSERT INTO props(name) VALUES('foo');
        INSERT INTO props(name) VALUES('bar');
        INSERT INTO props(name) VALUES('bazz');
              `;
    client.connect();
    await client.query(SQL);
    const port = process.env.PORT || 3000;

    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

setup();
