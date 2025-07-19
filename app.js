const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const path = require('path'); 
const app = express(); 
const session = require('express-session');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '0000', 
    resave: false,
    saveUninitialized: true, 
    cookie: { secure: false } 
}));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'BlossomDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});


app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {  
            console.log(err);
            return res.json({ message: 'Username/User already exists.' });
        }
        res.json({message: 'User registered successfully! You can now login.'});
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.log(err);
            return res.send('Server Error');
        } 

        if (results.length === 0) {
            return res.json({ message: 'User not found' });
        }

        const user = results[0]; 
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({ message: 'Incorrect password' });
        }

        req.session.username = username ;
        res.json({ username: username, redirect: '/logger' }); 
    });

});


function isAuthenticated(req, res, next) {
    if (req.session.username) {
        next(); 
    } else {
        res.redirect('/login'); 
    }
}

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.redirect('/home'); 
    });
});

//------------------------------------------------------------------

app.get('/api/history', async (req, res) => {
    const { username } = req.query;

    try {
        const [rows] = await db.promise().query(`
            SELECT entry_date, start_date, period_length, symptoms
            FROM cycle_logger
            WHERE username = ?
            ORDER BY entry_date DESC
        `, [username]);

        res.json(Array.isArray(rows) ? rows : []);
    } catch (error) {
        console.error('Error fetching history data:', error);
    }
});

//---------------------------------------------------------------------

app.get('/last-logged-period/:username', (req, res) => {
    const { username } = req.params;
  
    const query = `
      SELECT * FROM cycle_logger
      WHERE username = ?
      ORDER BY start_date DESC
      LIMIT 1
    `;
  
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.json({ message: 'Logg a period to start!' });
      }
    });
  });
  


app.post('/logger', (req, res) => {
    const {username, startDate, cycleLength, periodLength, symptoms} = req.body;

    const query_period = `INSERT INTO cycle_logger (username, start_date, cycle_length, period_length, symptoms) VALUES (?, ?, ?, ?,?)`;
    db.query(query_period, [username, startDate, cycleLength, periodLength, symptoms], (err, result) => {
        if (err) {
            console.error(err); 
            return res.json({message: 'Data has not been updated, maybe a period on this date already exists.' });
        }
            res.json({message: 'Cycle logged successfully' });
    });
});



app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/calc', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calc.html'));
});

app.get('/logger',isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logger.html'));
});

app.get('/education', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Education.html')); 
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Products.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); 
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/', (req, res) => {
    res.redirect('/home');
});


app.listen(5500, () => {
    console.log('Server is running on http://localhost:5500');
});