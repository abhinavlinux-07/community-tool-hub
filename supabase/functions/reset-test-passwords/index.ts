import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const updates = [
    { email: 'member@test.com', password: 'Test1234!', id: '9efa83ec-2935-49de-a0d0-d28db9e97dd0' },
    { email: 'architect@test.com', password: 'Test1234!', id: '9cb9c2c9-c84e-43f1-997b-c03f01782772' },
    { email: 'admin@test.com', password: 'Test1234!', id: '7aadddea-91d6-404b-8203-4a1e95ec16dd' },
    { email: 'doctor@test.com', password: 'Test1234!', id: 'ca77636b-ccfa-4c8f-8c92-5fcea705f7c7' },
  ]

  const results = []

  for (const u of updates) {
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${u.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({ password: u.password }),
    })
    const data = await res.json()
    results.push({ email: u.email, status: res.ok ? 'password_set' : 'error', detail: res.ok ? undefined : data })
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  })
})
