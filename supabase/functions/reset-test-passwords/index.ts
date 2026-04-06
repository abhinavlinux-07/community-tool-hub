import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const updates = [
    { email: 'member@test.com', password: 'Test1234!' },
    { email: 'architect@test.com', password: 'Test1234!' },
    { email: 'admin@test.com', password: 'Test1234!' },
    { email: 'doctor@test.com', password: 'Test1234!' },
  ]

  const { data: listData } = await supabase.auth.admin.listUsers()
  const results = []

  for (const u of updates) {
    const user = listData?.users?.find(x => x.email === u.email)
    if (user) {
      const { error } = await supabase.auth.admin.updateUser(user.id, { password: u.password })
      results.push({ email: u.email, status: error ? 'error' : 'password_set', error: error?.message })
    } else {
      results.push({ email: u.email, status: 'not_found' })
    }
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  })
})
