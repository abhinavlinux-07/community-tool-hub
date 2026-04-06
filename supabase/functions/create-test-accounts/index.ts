import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const testAccounts = [
    { email: 'member@test.com', password: 'Test1234!', fullName: 'Test Member', role: 'community_member' },
    { email: 'architect@test.com', password: 'Test1234!', fullName: 'Test Architect', role: 'architect' },
    { email: 'admin@test.com', password: 'Test1234!', fullName: 'Test Admin', role: 'admin' },
    { email: 'doctor@test.com', password: 'Test1234!', fullName: 'Test Doctor', role: 'tool_doctor' },
  ]

  const results = []

  for (const account of testAccounts) {
    // Create user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.fullName, role: account.role }
    })

    if (createError) {
      // If user exists, try to get them and update
      if (createError.message.includes('already been registered') || createError.message.includes('already exists')) {
        const { data: listData } = await supabase.auth.admin.listUsers()
        const existingUser = listData?.users?.find(u => u.email === account.email)
        if (existingUser) {
          // Update password
          await supabase.auth.admin.updateUser(existingUser.id, { password: account.password })
          // Ensure role exists
          await supabase.from('user_roles').upsert(
            { user_id: existingUser.id, role: account.role },
            { onConflict: 'user_id,role' }
          )
          // Ensure profile exists
          await supabase.from('profiles').upsert(
            { id: existingUser.id, full_name: account.fullName },
            { onConflict: 'id' }
          )
          results.push({ email: account.email, role: account.role, status: 'updated' })
          continue
        }
      }
      results.push({ email: account.email, role: account.role, status: 'error', error: createError.message })
      continue
    }

    const userId = userData.user.id

    // Create profile
    await supabase.from('profiles').upsert(
      { id: userId, full_name: account.fullName },
      { onConflict: 'id' }
    )

    // Create role
    await supabase.from('user_roles').upsert(
      { user_id: userId, role: account.role },
      { onConflict: 'user_id,role' }
    )

    results.push({ email: account.email, role: account.role, status: 'created' })
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
