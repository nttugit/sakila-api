import knex from 'knex';

export default knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sakila'
    },
    // cơ chế connection pooling giúp db 
    // không bị chết do có quá nhiều kết nối
    pool: { min: 0, max: 10 }
})

