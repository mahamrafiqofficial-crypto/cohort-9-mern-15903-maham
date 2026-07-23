const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register =async (req , res) => {
    try{
        const{ name, email, password} = req.body;

        if(!name || typeof name !== 'string' ||
            !email || typeof email !== 'string' ||
            !password || typeof password !== 'string')
            {
                return res.status(400).json({ success: false, message:'Name, email and password are required'});
            }
        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({ success:false, message:'Email already registered'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword});
        res.status(201).json({ success: true, message: 'User registered', useID: user._id});
    }catch (error) {
        if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during registration'});
    }
};

exports.login = async (req,res) => {
    try{
      const { email, password } =req.body;
      if (!email || typeof email !== 'string' ||
        !password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
      console.error('JWT_SECRET or JWT_EXPIRES_IN is not configured');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }
      const user = await User.findOne({ email});
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials'});
      }

      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
      const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.status(200).json({ success: true, token });
    }catch (error){
       console.error(error);
       res.status(500).json({ success: false, message: 'Server error during login'});
    
    }
};