const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_HOST == 'localhost' ? 5432 : process.env.DB_PORT,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', 
    (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
                return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], 
    (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.rows.length == 0) {
            return response.status(404).json({ error: 'Not Found' });
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { email, firebaseId } = request.body
    if (!email || !firebaseId) {
        response.status(422).send('Unprocessable Entity');
        return
    }
    pool.query('INSERT INTO users (email, firebaseid) VALUES ($1, $2) RETURNING * ', [email, firebaseId], 
    (error, results) => {
        if (error && error.code === '23505') {
            // Duplicate entry error
            return response.status(409).json({ error: 'User already exists!' });
        }
        if (error) {
            console.error('Error executing query:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        return response.status(201).json({message : `User added with ID: ${results.rows[0].id}`})
    })
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], 
    (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
                return response.status(500).json({ error: 'Internal Server Error' });
        }
        response.status(200).json({message: `User deleted with ID: ${id}`})
    })
}

const loginUser = (request, response) => {

    const {email, firebaseId} = request.body
    pool.query('INSERT INTO users (email, firebaseid) VALUES ($1, $2) RETURNING * ', [email, firebaseId], 
    (error, results) => {
        if (error && error.code === '23505') {
            // Duplicate entry error
            return response.status(409).json({ error: 'User already exists!' });
        }
        if (error) {
            console.error('Error executing query:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
        return response.status(201).json({message : `User added with ID: ${results.rows[0].id}`})
    })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  loginUser,
}
