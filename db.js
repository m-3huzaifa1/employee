const { connection } = require('./index');

// Create employees table if it doesn't exist

const createEmployeesTableQuery = `CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL
  )`;
  
  connection.query(createEmployeesTableQuery, (err) => {
    if (err) throw err;
    console.log('Employees table created');
  });
  
  // Create contact_details table if it doesn't exist
  const createContactDetailsTableQuery = `CREATE TABLE IF NOT EXISTS contact_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    emergency_contact VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    relationship VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  )`;
  
   connection.query(createContactDetailsTableQuery, (err) => {
    if (err) throw err;
    console.log('Contact details table created');
  });
  
