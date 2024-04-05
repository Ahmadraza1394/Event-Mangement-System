const express = require("express");
const validator = require("validator");
const app = express();
const bodyparser = require("body-parser");
const oracledb = require("oracledb");
const dbConfig = require("./dbConfig");
const dbConnection = require("./dbConnection");
const path = require("path");
app.use(express.static(path.join(__dirname, "views")));

const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const port = 4000;
app.set("view engine", "ejs");

// ___________________________For Home Page _________________________________
app.get("/", (req, res) => {
  res.render("home");
});

// ___________________________For Sign Up Page _________________________________
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", async (req, res) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Validate email using validator library
  if (!validator.isEmail(email)) {
    console.log("Invalid email");
    return res.status(400).send("Invalid email");
  }

  // Check password length
  if (password.length <= 7) {
    console.log("Password must be greater than 7 characters");
    return res.status(400).render("error", {
      message: "Password must be greater than 7 characters",
      message1: "Please enter password greater than 7 characters",
      link: "/signup",
    });
  }

  var sql = `INSERT INTO user_info(pname,username,passwords) VALUES ('${name}','${email}','${password}')`;

  if (name == "" || email == "" || password == "") {
    return res.status(400).send("All fields are required");
  } else {
    async function run() {
      let connection;
      try {
        connection = await dbConnection.getConnection();
        const result = await connection.execute(sql, [], { autoCommit: true });
        console.log("inserted");
      } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      } finally {
        if (connection) {
          try {
            await dbConnection.closeConnection(connection);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    run();
    let user = [[name], [email]];
    res.render("dashboard", { user: user, welcomeMessage: "Welcome, Dear" });
  }
});

// _______________________For Login Page ______________________________
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    async function run() {
      let connection;
      try {
        connection = await dbConnection.getConnection();
        const result = await connection.execute(
          `SELECT * FROM user_info WHERE username='${email}' AND passwords='${password}'`
        );
        console.log(result.rows);
        if (result.rows.length > 0) {
          req.session.loggedin = true;
          req.session.username = email;
          // res.redirect("/dashboard");
          res.render("dashboard", {
            user: result.rows[0],
            welcomeMessage: "Welcome Back,",
          });
          // res.send("Welcome back, " + email + "!" + " <a href='/'>Home</a>");
        } else {
          res.render("error", {
            message: "Incorrect Username and/or Password!",
            message1: "Please enter correct username and password",
            link: "/login",
          });
        }
        res.end();
      } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          try {
            await dbConnection.closeConnection(connection);
            //   console.error(err);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    run();
  } else {
    console.log(req.body);
    res.send(
      "Please enter Username and Password!" + " <a href='/login'>Login</a>"
    );
    res.end();
  }
});

// ________________________For Logout Page ______________________________
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// _______________________For Events Pages ______________________________
app.get("/choice", (req, res) => {
  res.render("choice");
});

// _____________________For Conference Events ____________________________
app.get("/conference", (req, res) => {
  res.render("conference");
});
// POST endpoint for fetching conference data
app.post("/conference", async (req, res) => {
  // Get the word from the request body
  const word = "Conference Event";

  // Validate if the word is empty
  if (!word || word.trim() === "") {
    res.status(400).send("Please provide a valid word");
    return;
  }

  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection(); // Adjust this based on your database connection logic
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT * FROM event WHERE event_name= :word`;

  try {
    const result = await connection.execute(
      sql,
      { word: word },
      { autoCommit: true }
    );

    // Handle results
    const eventData = result.rows.length > 0 ? result.rows : [];
    console.log(eventData);

    res.status(200).json(eventData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// _____________________For Wedding Events ____________________________
app.get("/wedding", (req, res) => {
  res.render("wedding");
});
// POST endpoint for fetching conference data
app.post("/wedding", async (req, res) => {
  // Get the word from the request body
  const word = "Wedding Event";

  // Validate if the word is empty
  if (!word || word.trim() === "") {
    res.status(400).send("Please provide a valid word");
    return;
  }

  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection(); // Adjust this based on your database connection logic
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT * FROM event WHERE event_name= :word`;

  try {
    const result = await connection.execute(
      sql,
      { word: word },
      { autoCommit: true }
    );

    // Handle results
    const eventData = result.rows.length > 0 ? result.rows : [];
    console.log(eventData);

    res.status(200).json(eventData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});
// _______________________For school Events ______________________________

app.get("/school", (req, res) => {
  res.render("school");
});
// POST endpoint for fetching school data
app.post("/school", async (req, res) => {
  // Get the word from the request body
  const word = "School Event";

  // Validate if the word is empty
  if (!word || word.trim() === "") {
    res.status(400).send("Please provide a valid word");
    return;
  }

  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection(); // Adjust this based on your database connection logic
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT * FROM event WHERE event_name= :word`;

  try {
    const result = await connection.execute(
      sql,
      { word: word },
      { autoCommit: true }
    );

    // Handle results
    const eventData = result.rows.length > 0 ? result.rows : [];
    console.log(eventData);

    res.status(200).json(eventData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// _____________________For Add Event ____________________________
app.get("/addevent", (req, res) => {
  res.render("addevent");
});

// Add event to database
app.post("/addevent", async (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const name = req.body.name;
  const description = req.body.description;
  const venue = req.body.venue;
  const capacity = req.body.capacity;

  console.log(id, name, description, venue, capacity);

  const sql = `INSERT INTO event(event_id, event_name, event_description, location, capacity) VALUES ('${id}', '${name}', '${description}', '${venue}','${capacity}')`;

  try {
    const connection = await dbConnection.getConnection();
    const result = await connection.execute(sql, [], { autoCommit: true });
    console.log("Event inserted");
    res.json({ message: "Event added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// _________For Delete Events  by using id__________
app.post("/deleteweddingevent/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  const sql = `DELETE FROM event WHERE event_id = '${eventId}'`;

  try {
    const connection = await dbConnection.getConnection();
    const result = await connection.execute(sql, [], { autoCommit: true });

    if (result.rowsAffected > 0) {
      console.log(`Wedding event with ID ${eventId} deleted`);
      res.json({ message: "Wedding event deleted successfully" });
    } else {
      res.status(404).json({ error: "Wedding event not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Dashboard
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

// _____________________For organizer ____________________________
app.get("/organizer", (req, res) => {
  res.render("organizer");
});

app.post("/organizer", async (req, res) => {
  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection(); // Adjust this based on your database connection logic
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT * FROM  staff`;

  try {
    const result = await connection.execute(sql);

    // Handle results
    const organizerData = result.rows.length > 0 ? result.rows : [];
    console.log(organizerData);

    res.status(200).json(organizerData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// _____________________For Attendee ____________________________
app.get("/attendee", (req, res) => {
  res.render("attendee");
});

app.post("/attendee", async (req, res) => {
  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection(); // Adjust this based on your database connection logic
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT * FROM  attendee`;

  try {
    const result = await connection.execute(sql);

    // Handle results
    const organizerData = result.rows.length > 0 ? result.rows : [];
    console.log(organizerData);

    res.status(200).json(organizerData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Serve the HTML page
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
