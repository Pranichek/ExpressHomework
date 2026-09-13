import express from 'express'

const app = express()

const HOST = 'localhost'
const PORT = 8888

app.get('/timestamp', (req, res) => {
    const currentDate = new Date();

    res.json({
        timestamp: currentDate
    });
})

app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    });
})

app.get('/stats', (req, res) => {
    res.json({
        uptime: process.uptime(),          
        nodeVersion: process.version,      
        timestamp: new Date()
    });
})


app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})