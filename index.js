import express from 'express'

const app = express()

const HOST = 'localhost'
const PORT = 8888

const products = [
    { id: 1, name: 'Смартфон', price: 500, category: 'electronics' },
    {id: 2, name: 'Ноутбук',price: 1200, category: 'electronics' },
    { id: 3, name: 'стіл', price: 200, category: 'furniture' },
    {id: 4, name: 'крісло', price: 180, category: 'furniture' },
    { id: 5, name: 'Книга', price: 35, category: 'books' }]

app.get('/products', (req, res) => {
    let result = products

    if (req.query.category) {
        result = result.filter((item) => {
            return item.category == req.query.category
        })
    }

    if (req.query.take) {
        result = result.slice(0, req.query.take)
    }
    res.json(result)
})

app.get('/products/:id', (req, res) => {
    const product = products.find((item) => {
        return item.id == req.params.id
    })

    
    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ message: 'Productss not found' })
    }
});

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