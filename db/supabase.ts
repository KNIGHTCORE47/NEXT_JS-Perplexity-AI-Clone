import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// NOTE - Establish environment variables connection
dotenv.config({
    path: '.env.local'
})

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// NOTE - Check environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing environment variables')
}


// NOTE - Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)