import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dfxtolxpnpdjiwuaercd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeHRvbHhwbnBkaml3dWFlcmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODE4MTYsImV4cCI6MjA2OTM1NzgxNn0.Rk90KzQ9Wq6upMvvSuHqrBxuJLft73i9jgsQgllDctI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Contact {
  id: number
  name: string
  hospital_name?: string
  position?: string
  phone: string
  email?: string
  message?: string
  interest_products?: string[]
  created_at: string
  status: string
}

export interface DemoRequest {
  id: number
  contact_name: string
  hospital_name?: string
  phone: string
  email?: string
  preferred_product?: string
  preferred_time?: string
  message?: string
  created_at: string
  status: string
}

export interface News {
  id: number
  title: string
  content?: string
  summary?: string
  image_url?: string
  published_at?: string
  created_at: string
  updated_at: string
  status: string
  author?: string
}

export interface ProductCase {
  id: number
  title: string
  hospital_name?: string
  product_name?: string
  description?: string
  result_summary?: string
  image_url?: string
  created_at: string
  updated_at: string
  status: string
}

// API functions for form submissions
export const submitContact = async (contactData: Omit<Contact, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      ...contactData,
      status: 'new',
      created_at: new Date().toISOString()
    }])
    .select()
  
  if (error) throw error
  
  return {
    data: {
      message: '感谢您的联系，我们将在24小时内与您取得联系！',
      contact_id: data[0]?.id,
      status: 'success'
    }
  }
}

export const submitDemoRequest = async (demoData: Omit<DemoRequest, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('demo_requests')
    .insert([{
      ...demoData,
      status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select()
  
  if (error) throw error
  
  return {
    data: {
      message: '演示预约申请已提交成功！我们的产品专家将在1个工作日内联系您安排演示时间。',
      demo_id: data[0]?.id,
      status: 'success'
    }
  }
}

export const getNews = async (limit?: number) => {
  let query = supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  // 只有在指定limit时才应用限制
  if (limit !== undefined) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export const getProductCases = async (limit = 10) => {
  const { data, error } = await supabase
    .from('product_cases')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}