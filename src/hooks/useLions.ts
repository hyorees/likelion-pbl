import { useState, useEffect } from 'react';
import { Lion } from '../types/lion';
import { supabase } from '../lib/supabase';
import { mapRowToLion, mapLionToInsert } from '../utils/mapper';

export function useLions() {
  const [lions, setLions] = useState<Lion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('준비 완료');

  const fetchLions = async () => {
    setLoading(true);
    setStatus('불러오는 중...');
    const { data, error } = await supabase
      .from('lions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      setStatus('요청 실패');
    } else {
      setLions((data || []).map(mapRowToLion));
      setStatus('준비 완료');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLions();
  }, []);

  const addLion = async (lionData: Omit<Lion, 'id'>) => {
    setStatus('추가 중...');
    const insertData = mapLionToInsert(lionData);
    console.debug('Supabase insert payload:', insertData);

    const { data, error } = await supabase
      .from('lions')
      .insert([insertData])
      .select();

    if (!error && data) {
      setLions(prev => [...prev, mapRowToLion(data[0])]);
      setStatus('준비 완료');
    } else {
      console.error('Supabase insert payload:', insertData);
      console.error('Supabase insert error:', error);
      if (error) {
        console.error('Supabase insert details:', error.message, error.details, error.hint, error.code);
      }
      setStatus('요청 실패');
    }
  };

  const deleteLastLion = async () => {
    if (lions.length === 0) return;
    setStatus('삭제 중...');
    const lastLion = lions[lions.length - 1];
    const { error } = await supabase
      .from('lions')
      .delete()
      .eq('id', lastLion.id);

    if (!error) {
      setLions(prev => prev.slice(0, -1));
      setStatus('준비 완료');
    } else {
      setStatus('요청 실패');
    }
  };

  return { lions, loading, status, addLion, deleteLastLion, refetch: fetchLions };
}