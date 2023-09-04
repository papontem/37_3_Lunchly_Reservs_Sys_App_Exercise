/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {

  /**
   * Create a new Customer instance.
   * 
   * @param {Object} params - The customer's details.
   * @param {number} params.id - The unique identifier for the customer.
   * @param {string} params.firstName - The first name of the customer.
   * @param {string} params.lastName - The last name of the customer.
   * @param {string} params.phone - The phone number of the customer.
   * @param {string} params.notes - Additional notes about the customer.
   */

  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
  }

  /**
   * Static class method used to retrieve all customers from the database.
   * 
   * @returns {Array} An array of new Customer class instances, each representing a customer row from the db.
   */
  static async all() {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes
       FROM customers
       ORDER BY last_name, first_name`
    );
    return results.rows.map(c => new Customer(c));
  }

  /**
   * get a customer by their ID.
   * 
   * @param {number} id - The unique identifier of the customer to retrieve.
   * @throws {Error} Throws a 404 error if the customer with a matching id is not found.
   * @returns {Customer} A new Customer class instance made using the obj retrieved from the db
   */
  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }


  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, notes=$4
             WHERE id=$5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }

  /** Returns the customers fullname as a single string, currently just the first and lastname */
  fullName(){
    return `${this.firstName} ${this.lastName}`
  }
}

module.exports = Customer;
