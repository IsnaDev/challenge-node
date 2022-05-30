const { request } = require('express')
const { response } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000
const serve = express()
serve.use(express.json())

const listOrderClient = []

// pedidos
const checkIdExist = (request, response, next) => {
    const { id } = request.params

    const index = listOrderClient.findIndex(client => client.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Client not found" })
    }

    //retornar o pedido completo do array
    const orderClient = listOrderClient.find((client) => client.id === id)

    if (orderClient < 0) {
        return response.status(404).json({error: "Client not found"})
    }

    request.id = id
    request.index = index
    request.orderClient = orderClient

    next()
}

const methodUrl = (request, response, next) => {
    const method = request.method
    const url = request.path
    console.log("Method:", "[", method, "]", "-", "URL:", url)

    next()
}

serve.use((request, response, next) => {
    console.log(request.method)
    console.log(request.url)
    
    next()
})

// CADASTRA UM PEDIDO 👇🏻
serve.post("/order", (request, response) => {
    const { order, clientName, price } = request.body;

    const orderClient = {
        id: uuid.v4(),
        order,
        clientName,
        price,
        status: "Em preparação",
    }

    listOrderClient.push(orderClient)

    return response.status(201).json(orderClient)
})

//listar todos os pedidos
serve.get("/order", (request, response) => {
    return response.json(listOrderClient)
})

//alterar um pedido 👇🏻
serve.put("/order/:id", checkIdExist, (request, response) => {
    const id = request.id

    const index = request.index

    const {order, clientName, price} = request.body

    const updateOrderClient = {
        id,
        order,
        clientName,
        price,
        status: "em preparação"
    }

    listOrderClient[index] = updateOrderClient

    return response.json(updateOrderClient)
})

//deletar um pedido
serve.delete("/order/:id", checkIdExist, (request, response) => {
    const index = request.index

    listOrderClient.splice(index, 1)

    return response.status(204).json()
})

//pedido especifico
serve.get("/order/:id", checkIdExist, (request, response) => {
    const orderClient = request.orderClient

    return response.json(orderClient)
})

//alterar status
serve.patch("/order/:id", checkIdExist, (request, response) => {
    const orderClient = request.orderClient

    orderClient.status = "Pronto"

    return response.send(orderClient)
})

// PORTA 👇🏻
serve.listen(port, () => {
    console.log(`SERVER STARTED ON PORT ${port}`)
})