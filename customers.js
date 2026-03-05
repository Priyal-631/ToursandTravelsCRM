import { supabase } from "../lib/supabaseClient";

export const getCustomers = async (filters = {}) => {

  let query = supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.type) {
    query = query.eq("tour_type", filters.type);
  }

  if (filters.type === "National" && filters.state) {
    query = query.eq("state", filters.state);
  }

  if (filters.type === "International" && filters.country) {
    query = query.eq("country", filters.country);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const createCustomer = async (payload) => {
  const { data, error } = await supabase
    .from("customers")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCustomer = async (id, payload) => {
  const { data, error } = await supabase
    .from("customers")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};