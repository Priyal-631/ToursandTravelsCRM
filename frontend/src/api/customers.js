/**
 * src/api/customers.js
 *
 * Supabase data layer for the Customers feature.
 * Uses the same relational schema as Dashboard/Index.jsx:
 *   customers (1) ──< tours (many)
 *
 * ── TABLES ───────────────────────────────────────────────────────────
 * customers:
 *   id, full_name, contact_number, whatsapp_number,
 *   email_id, departure_city, follow_up_status, created_at
 *
 * tours:
 *   id, customer_id (FK), destination, package_type,
 *   start_date, end_date, number_of_adults, number_of_children,
 *   amount_paid, amount_pending, status, notes,
 *   tour_type_id (FK → tour_types.id),
 *   state_id     (FK → states.id),
 *   country_id   (FK → countries.id)
 */

import { apiClient } from "@/api/apiClient";

// ── Shared select string (mirrors Dashboard query) ────────────────────
const CUSTOMER_SELECT = `
  id,
  full_name,
  contact_number,
  whatsapp_number,
  email_id,
  departure_city,
  follow_up_status,
  created_at,
  tours (
    id,
    destination,
    package_type,
    start_date,
    end_date,
    number_of_adults,
    number_of_children,
    amount_paid,
    amount_pending,
    status,
    notes,
    tour_type:tour_type_id ( name ),
    state:state_id ( name ),
    country:country_id ( name )
  )
`

/**
 * Fetch all customers with nested tours, newest first.
 * @returns {Promise<Customer[]>}
 */
export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select(CUSTOMER_SELECT)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Add a new customer row, then add the linked tour row.
 *
 * @param {object} customerFields  — fields for customers table
 * @param {object} tourFields      — fields for tours table (optional)
 * @returns {Promise<Customer>}    — newly inserted customer with tours
 */
export async function addCustomer(customerFields, tourFields = null) {
  const { data: newCustomer, error: custErr } = await supabase
    .from("customers")
    .insert([customerFields])
    .select("id")
    .single()

  if (custErr) throw custErr

  if (tourFields && Object.keys(tourFields).length > 0) {
    const { error: tourErr } = await supabase
      .from("tours")
      .insert([{ ...tourFields, customer_id: newCustomer.id }])
    if (tourErr) throw tourErr
  }

  const { data, error } = await supabase
    .from("customers")
    .select(CUSTOMER_SELECT)
    .eq("id", newCustomer.id)
    .single()

  if (error) throw error
  return data
}

/**
 * Update customer-level fields only (customers table).
 * @param {string} customerId
 * @param {object} fields
 * @returns {Promise<Customer>}
 */
export async function updateCustomerFields(customerId, fields) {
  const { error } = await supabase
    .from("customers")
    .update(fields)
    .eq("id", customerId)

  if (error) throw error

  const { data, error: fetchErr } = await supabase
    .from("customers")
    .select(CUSTOMER_SELECT)
    .eq("id", customerId)
    .single()

  if (fetchErr) throw fetchErr
  return data
}

/**
 * Update tour-level fields only (tours table).
 * @param {string} tourId
 * @param {object} fields
 * @returns {Promise<void>}
 */
export async function updateTourFields(tourId, fields) {
  const { error } = await supabase
    .from("tours")
    .update(fields)
    .eq("id", tourId)

  if (error) throw error
}

/**
 * Hard-delete a customer (cascades to tours if FK ON DELETE CASCADE is set).
 * @param {string} customerId
 */
export async function deleteCustomer(customerId) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId)

  if (error) throw error
}

// ── JSDoc Types ───────────────────────────────────────────────────────
/**
 * @typedef {object} Customer
 * @property {string}        id
 * @property {string}        full_name
 * @property {string}        contact_number
 * @property {string}        whatsapp_number
 * @property {string}        email_id
 * @property {string}        departure_city
 * @property {string}        follow_up_status
 * @property {string}        created_at
 * @property {Tour[]}        tours
 *
 * @typedef {object} Tour
 * @property {string}        id
 * @property {string}        destination
 * @property {string}        package_type
 * @property {string}        start_date
 * @property {string}        end_date
 * @property {number}        number_of_adults
 * @property {number}        number_of_children
 * @property {number}        amount_paid
 * @property {number}        amount_pending
 * @property {string}        status
 * @property {string}        notes
 * @property {{name:string}} tour_type
 * @property {{name:string}} state
 * @property {{name:string}} country
 */
