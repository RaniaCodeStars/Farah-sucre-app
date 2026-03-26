import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useHalwas(type = null) {
  const [halwas, setHalwas]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('halwas')
        .select('*')
        .eq('disponible', true)
        .order('bestseller', { ascending: false })
        .order('nom')

      if (type) query = query.eq('type', type)

      const { data } = await query
      setHalwas(data || [])
      setLoading(false)
    }
    fetch()
  }, [type])

  return { halwas, loading }
}

export function useBestsellers() {
  const [halwas, setHalwas]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('halwas')
      .select('*')
      .eq('bestseller', true)
      .eq('disponible', true)
      .limit(4)
      .then(({ data }) => { setHalwas(data || []); setLoading(false) })
  }, [])

  return { halwas, loading }
}
