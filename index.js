var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

var schema = buildSchema(`

    type Cliente {
        id: Int 
        nombre: String
        telefono: String
        mail: String
        }

    type Query {
        clientes: [Cliente]
        cliente(id: Int): Cliente
        }
    
    type Mutation {
        addCliente(nombre: String, telefono: String, mail: String): Cliente
        deleteCliente(nombre: String, telefono: String, mail: String): Cliente

    }
`);

var clientes = [];
var counter = 1;

//Funcion para resolver las peticiones
var root = {
    clientes: () => { return clientes; },
    cliente: ( data ) => {
        for (var i = 0; i < clientes.length; i++)
            if ( clientes[i].id === data.id )
                return clientes[i];
        return null;
    },

    addCliente: ( data ) => {
        var c = {'id': counter, 'nombre':data.nombre, 'telefono': data.telefono, 'mail': data.mail};
        clientes.push ( c );
        counter++;
        return c;
    },

    deleteCliente: ( data ) => {
        var c = {'id': counter, 'nombre':data.nombre, 'telefono': data.telefono, 'mail': data.mail};
        clientes.pop ( c );
        counter--;
        return c;
    }
}

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');