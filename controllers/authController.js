const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.checkCredentials = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // Here you can add any additional validation for password strength, etc.

        res.status(200).json({ success: true, message: 'Credentials valid' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // add salt to password
        console.log("1111",req.body);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, isVerified: true });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(201).json({ success: true, message: 'User registered and logged in successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.checkLoginCredentials = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('request123', req.body);
    
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        // const hashedPassword = bcrypt.hashSync(password, 10);
        // console.log('hashedPassword:', hashedPassword);
        // console.log('password from user:', user.password);
        // console.log('password from request:', password);
        // const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        // console.log('isPasswordValid:', isPasswordValid);
        //if (!isPasswordValid) {
        //     ret
        // urn res.status(401).json({ success: false, error: 'Invalid credentials' });
        // }

        // If credentials are valid, we don't log in yet, just send success
        //const hashedPassword = bcrypt.hashSync(password, 10);
        // console.log('Password from request:', password);
        // console.log('Stored hashed password:', hashedPassword);
        // console.log('Stored hashed password:', user.password);

        //const isPasswordValid = await bcrypt.compare(password, user.password);
        //console.log('isPasswordValid', isPasswordValid);
        res.status(200).json({ success: true, message: 'Credentials valid' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim(); // Ensure password is trimmed
        console.log('request', req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        console.log('user', user);
        if (!user.password) {
            return res.status(401).json({ success: false, error: 'Password not set for user' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('isPasswordValid', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        res.status(200).json({ success: true, message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

