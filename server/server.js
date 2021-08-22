import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import https from 'https';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ExpressGraphQL = require('express-graphql').graphqlHTTP;
import depthlimit from 'graphql-depth-limit';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import AuthRoute from './Routes/check-auth.js';
import LoginRoute from './Routes/login.js';
import SignupRoute from './Routes/signup.js';
import MainSchema from './GraphQL/MainConf.js';
dotenv.config();

const PORT = 8080;
const config = {
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
};
const app = express();
const server = https.createServer(config, app);

// middleware
app.use(cors({
    origin: ['https://localhost:3000']
}))
app.use(express.json({limit: '50mb'}));

// Socket connection
const io = new Server(server, {
    cors: {
        origin: "https://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', socket => {
    socket.on('disconnect', () => {
        console.log('disconnected');
    })
})

// GraphQL
app.use('/graphql', ExpressGraphQL({
    graphiql: true,
    schema: MainSchema,
    validationRules: [depthlimit(2)]
}))

// RestAPI
app.use('/checkAuth', AuthRoute);
app.use('/login', LoginRoute);
app.use('/signup', SignupRoute);

// DB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to mongoDB');
}).catch(() => {
    console.log('Did not connect to mongoDB');
})

// main listener
server.listen(PORT, () => {
    console.log(`Connected to localhost:${PORT}`)
});
