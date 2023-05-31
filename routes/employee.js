const express = require('express');
const router = express.Router();
const { connection } = require('../index');
const { app } =require('../index')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

//insert details
router.post('/employees', (req, res) => {
    const { fullName, jobTitle, phoneNumber, email, address, city, state, primaryEmergencyContact, primaryPhoneNumber, primaryRelationship, secondaryEmergencyContact, secondaryPhoneNumber, secondaryRelationship } = req.body;
    //console.log(fullName, jobTitle, phoneNumber, email, address, city, state, primaryEmergencyContact, primaryPhoneNumber, primaryRelationship, secondaryEmergencyContact, secondaryPhoneNumber, secondaryRelationship)
    const createEmployeeQuery = 'INSERT INTO employees (full_name, job_title, phone_number, email, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(createEmployeeQuery, [fullName, jobTitle, phoneNumber, email, address, city, state], (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to create employee' });
      } else {
        const employeeId = result.insertId;
  
        // Insert the primary emergency contact into the 'contact_details' table
        const createPrimaryContactQuery = 'INSERT INTO contact_details (employee_id, emergency_contact, phone_number, relationship) VALUES (?, ?, ?, ?)';
        connection.query(createPrimaryContactQuery, [employeeId, primaryEmergencyContact, primaryPhoneNumber, primaryRelationship], (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to create primary emergency contact' });
          }
        });
  
        // Insert the secondary emergency contact into the 'contact_details' table
        const createSecondaryContactQuery = 'INSERT INTO contact_details (employee_id, emergency_contact, phone_number, relationship) VALUES (?, ?, ?, ?)';
        connection.query(createSecondaryContactQuery, [employeeId, secondaryEmergencyContact, secondaryPhoneNumber, secondaryRelationship], (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to create secondary emergency contact' });
          }
        });
  
        res.status(201).json({ message: 'Employee created successfully' });
      }
    });
  });
  
  // List Employees with pagination
  router.get('/employees', (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
  
    const listEmployeesQuery = 'SELECT * FROM employees,contact_details LIMIT ? OFFSET ?';
    connection.query(listEmployeesQuery, [limit, offset], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Failed to list employees' });
      } else {
        res.json(results);
      }
    });
    /*const listEmployeeQuery = 'SELECT * FROM contact_details LIMIT ? OFFSET ?';
    connection.query(listEmployeeQuery, [limit, offset], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Failed to list contact' });
      } else {
        res.json(results);
      }
    });*/
  });
  
  // Update Employee
  router.put('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { fullName, jobTitle, phoneNumber, email, address, city, state, primaryEmergencyContact, primaryPhoneNumber, primaryRelationship, secondaryEmergencyContact, secondaryPhoneNumber, secondaryRelationship } = req.body;
  
    const updateEmployeeQuery = 'UPDATE employees SET full_name = ?, job_title = ?, phone_number = ?, email = ?, address = ?, city = ?, state = ? WHERE id = ?';
    connection.query(updateEmployeeQuery, [fullName, jobTitle, phoneNumber, email, address, city, state, employeeId], (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to update employee' });
      } else {
        // Update the primary emergency contact
        const updatePrimaryContactQuery = 'UPDATE contact_details SET emergency_contact = ?, phone_number = ?, relationship = ? WHERE employee_id = ? AND relationship = ?';
        connection.query(updatePrimaryContactQuery, [primaryEmergencyContact,primaryPhoneNumber, primaryRelationship, employeeId, 'primary'], (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to update primary emergency contact' });
          }
        });
  
        // Update the secondary emergency contact
        const updateSecondaryContactQuery = 'UPDATE contact_details SET emergency_contact = ?, phone_number = ?, relationship = ? WHERE employee_id = ? AND relationship = ?';
        connection.query(updateSecondaryContactQuery, [secondaryEmergencyContact,secondaryPhoneNumber, secondaryRelationship, employeeId, 'secondary'], (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to update secondary emergency contact' });
          }
        });
  
        res.json({ message: 'Employee updated successfully' });
      }
    });
  });
  
  // Delete Employee
  router.delete('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
  

    connection.query('DELETE FROM contact_details WHERE employee_id = ?', [employeeId], (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to delete contact' });
      } else { 
        const deleteEmployeeQuery = 'DELETE FROM employees WHERE id = ?';
      
        connection.query(deleteEmployeeQuery, [employeeId], (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to delete employee' });
          } else {
            res.json({ message: 'Employee deleted successfully' });
            
          }
        });
      }
   
    
    });
  });
  
  // Get Employee
  router.get('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
  
    const getEmployeeQuery = 'SELECT * FROM employees WHERE id = ?';
    connection.query(getEmployeeQuery, [employeeId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Failed to get employee' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'Employee not found' });
        } else {
          const employee = { ...results[0] };
  
          // Get primary emergency contact details
          const getPrimaryContactQuery = 'SELECT * FROM contact_details WHERE employee_id = ? AND relationship = ?';
          connection.query(getPrimaryContactQuery, [employeeId, 'primary'], (err, primaryContact) => {
            if (err) {
              res.status(500).json({ error: 'Failed to get primary emergency contact details' });
            } else {
              employee.primaryEmergencyContact = primaryContact[0];
              
              // Get the secondary emergency contact details
              const getSecondaryContactQuery = 'SELECT * FROM contact_details WHERE employee_id = ? AND relationship = ?';
              connection.query(getSecondaryContactQuery, [employeeId, 'secondary'], (err, secondaryContact) => {
                if (err) {
                  res.status(500).json({ error: 'Failed to get secondary emergency contact details' });
                } else {
                  employee.secondaryEmergencyContact = secondaryContact[0];
                  res.json(employee);
                }
              });
            }
          });
        }
      }
    });
  });
  
  module.exports = router;