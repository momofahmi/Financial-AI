const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { spawn } = require('child_process');
mongoose.set('strictQuery', true);

/************** */
const CompanyRoutes = require('./routes/CompanyR');
/************** */

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const checkAuth = require('./middleware/checkAuth');
const checkAuthCom = require('./middleware/checkAuthCom');

app.get('/', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'indexx.html'));
});

const runPythonScript = async (param) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['LSTM.py', param]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`Output: ${data}`);
      
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error('Python script failed'));
      }
    });
  });
};

app.get('/run-model', async (req, res) => {
  try {
    const documentId = req.query.id ;
    const output = await runPythonScript(documentId);
    const result = JSON.parse(output);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error running Python script or parsing output');
  }
});

app.get('/manual-input', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manual_input.html'));
});

// Route to serve the file upload form
app.get('/upload-file', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// Serve HTML public dynamically
app.get('/getCompany', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'getCompany.html'));
});

app.get('/deleteCompany', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'deleteCompany.html'));
});

// Root Endpoint
app.get('/company', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/login', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/dashboard', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.get('/metrics', checkAuthCom, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'metrics.html'));
});

app.use('/apicomp', checkAuthCom, CompanyRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));