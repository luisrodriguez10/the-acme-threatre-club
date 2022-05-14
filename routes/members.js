const client = require('../db')
const app = require('express').Router()

module.exports = app;

app.post('/', async(req,res,next) => {

    try {
        const response = await client.query('INSERT INTO members(name) VALUES($1) returning *', [req.body.name])
        res.redirect(`/members/${response.rows[0].id}`)
    } catch (error) {
        next(error)
    }
})

app.get("/", async (req, res, next) => {
    try {
      const response = await client.query("SELECT * FROM members;");
      const members = response.rows;
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
                  <form method='POST'>
                    <input name='name'/>
                    <button>Create</button>
                  </form>
                  <ul>
                      ${members
                        .map(
                          (member) => `
                          <li><a href='/members/${member.id}'>${member.name}</a></li>
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
  
  app.get("/:id", async (req, res, next) => {
      try {
        const response = await client.query("SELECT * FROM members WHERE id=$1;", [req.params.id]);
        const members = response.rows;
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
                        ${members
                          .map(
                            (member) => `
                            <li><a href='/members/'>${member.name}</a></li>
                        `
                          )
                          .join("")}
                    </ul>
                    <div>
                              Show details for ${members[0].name}
                    </div>
                </body>
            </html>
        `);
      } catch (error) {
        next(error);
      }
    });