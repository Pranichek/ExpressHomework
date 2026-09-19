import express from 'express'

const app = express()

const HOST = 'localhost'
const PORT = 8888

app.use(express.json())

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

function addProduct(newProduct, fail) {
    return new Promise(function (resolve, reject) {

        if (fail === true) {
            reject(new Error("can't save product"))
            return
        }

        let id

        if (products.length === 0) {
            id = 1
        } else {
            let lastIndex = products.length - 1
            let lastProduct = products[lastIndex]
            id = lastProduct.id + 1
        }

        let product = {
            id: id,
            name: newProduct.name,
            price: newProduct.price,
            category: newProduct.category,
            image: newProduct.image
        }

        products.push(product)

        resolve(product)
    })
}

app.post('/products', async (req, res) => {
    const name = req.body.name
    const price = req.body.price
    const category = req.body.category
    let image = req.body.image

    let isValid = true

    if (typeof name !== "string" || name.trim() === "") {
        isValid = false
    }
    if (typeof price !== "number" || price <= 0) {
        isValid = false
    }
    if (typeof category !== "string" || category.trim() === "") {
        isValid = false
    }

    if (isValid === false) {
        return res.status(422).json({ message: "Invalid product data" })
    }

    let exists = false
    for (let i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase() === name.toLowerCase()) {
            exists = true
        }
    }

    if (exists === true) {
        return res.status(409).json({ message: "Conflict" })
    }

    if (image === undefined) {
        image = ""
    }

    let newProduct = {
        name: name,
        price: price,
        category: category,
        image: image
    }

    let fail = false
    if (req.query.fail === "true") {
        fail = true
    }

    try {
        let saved = await addProduct(newProduct, fail)
        res.status(201).json(saved)
    } catch (error) {
        res.status(500).json({ message: "Не вдалося зберегти продукт" })
    }
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