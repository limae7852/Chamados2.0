import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE; // chave secreta do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('tickets').select('*').order('id', { ascending: true });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const ticket = req.body;
      const { data, error } = await supabase.from('tickets').insert([ticket]);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data[0]);
    }

    if (req.method === 'PATCH') {
      const { id, status } = req.body;
      const { data, error } = await supabase.from('tickets').update({ status }).eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
