import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

// Transform Supabase snake_case row → camelCase app object
const toUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    avatar: row.avatar,
    assignedPT: row.assigned_pt,
    completedSessions: row.completed_sessions || [],
    createdAt: row.created_at,
    // compute clients list dynamically — not stored on PT row
  };
};

const toFeedback = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    sessionKey: row.session_key,
    week: row.week,
    session: row.session,
    date: row.date,
    rating: row.rating,
    effort: row.effort,
    completed: row.completed,
    notes: row.notes,
    injuries: row.injuries,
    duration: row.duration,
  };
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const [{ data: usersData }, { data: feedbackData }] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('feedback').select('*').order('date', { ascending: false }),
      ]);
      setUsers((usersData || []).map(toUser));
      setFeedback((feedbackData || []).map(toFeedback));
    } catch (e) {
      console.error('Failed to load data from Supabase', e);
    }
    setInitialized(true);
  };

  // Reload users from Supabase and update local state
  const refreshUsers = async () => {
    const { data } = await supabase.from('users').select('*');
    const mapped = (data || []).map(toUser);
    setUsers(mapped);
    return mapped;
  };

  const refreshFeedback = async () => {
    const { data } = await supabase.from('feedback').select('*').order('date', { ascending: false });
    const mapped = (data || []).map(toFeedback);
    setFeedback(mapped);
    return mapped;
  };

  // --- User queries (served from in-memory cache) ---
  const getAllUsers = () => users;
  const getUserById = (id) => users.find((u) => u.id === id) || null;
  const getPTs = () => users.filter((u) => u.role === 'pt');
  const getClients = () => users.filter((u) => u.role === 'user');
  const getClientsForPT = (ptId) => users.filter((u) => u.role === 'user' && u.assignedPT === ptId);

  // --- User mutations ---
  const createPT = async ({ name, email, password }) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('Email already in use');

    const newPT = {
      id: `pt${Date.now()}`,
      name,
      email,
      password,
      role: 'pt',
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      assigned_pt: null,
      completed_sessions: [],
      created_at: new Date().toISOString().split('T')[0],
    };

    const { error } = await supabase.from('users').insert([newPT]);
    if (error) throw new Error(error.message);
    await refreshUsers();
    return toUser(newPT);
  };

  const createClient = async ({ name, email, password, assignedPT }) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new Error('Email already in use');

    const newClient = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      assigned_pt: assignedPT || null,
      completed_sessions: [],
      created_at: new Date().toISOString().split('T')[0],
    };

    const { error } = await supabase.from('users').insert([newClient]);
    if (error) throw new Error(error.message);
    await refreshUsers();
    return toUser(newClient);
  };

  const assignClientToPT = async (clientId, ptId) => {
    const { error } = await supabase
      .from('users')
      .update({ assigned_pt: ptId })
      .eq('id', clientId);
    if (error) throw new Error(error.message);
    await refreshUsers();
  };

  const deletePT = async (ptId) => {
    // Unassign all clients first
    await supabase.from('users').update({ assigned_pt: null }).eq('assigned_pt', ptId);
    const { error } = await supabase.from('users').delete().eq('id', ptId);
    if (error) throw new Error(error.message);
    await refreshUsers();
  };

  const deleteClient = async (clientId) => {
    const { error } = await supabase.from('users').delete().eq('id', clientId);
    if (error) throw new Error(error.message);
    await refreshUsers();
  };

  // --- Feedback ---
  const addFeedback = async (feedbackData) => {
    const sessionKey = `${feedbackData.week}-${feedbackData.session}`;
    const newEntry = {
      id: `fb${Date.now()}`,
      user_id: feedbackData.userId,
      user_name: feedbackData.userName,
      session_key: sessionKey,
      week: feedbackData.week,
      session: feedbackData.session,
      date: new Date().toISOString().split('T')[0],
      rating: feedbackData.rating,
      effort: feedbackData.effort,
      completed: feedbackData.completed,
      notes: feedbackData.notes || '',
      injuries: feedbackData.injuries || '',
      duration: feedbackData.duration || 0,
    };

    const { error } = await supabase.from('feedback').insert([newEntry]);
    if (error) throw new Error(error.message);

    // Mark session complete on user row
    const user = users.find((u) => u.id === feedbackData.userId);
    if (user) {
      const completed = user.completedSessions || [];
      if (!completed.includes(sessionKey)) {
        const updated = [...completed, sessionKey];
        await supabase
          .from('users')
          .update({ completed_sessions: updated })
          .eq('id', feedbackData.userId);
      }
    }

    await Promise.all([refreshUsers(), refreshFeedback()]);
    return toFeedback(newEntry);
  };

  const getFeedbackForUser = (userId) =>
    feedback.filter((f) => f.userId === userId);

  const getFeedbackForPT = (ptId) => {
    const clientIds = users.filter((u) => u.assignedPT === ptId).map((u) => u.id);
    return feedback.filter((f) => clientIds.includes(f.userId));
  };

  const getAllFeedback = () => feedback;

  return (
    <DataContext.Provider
      value={{
        initialized,
        users,
        getAllUsers,
        getUserById,
        getPTs,
        getClients,
        getClientsForPT,
        createPT,
        createClient,
        assignClientToPT,
        deletePT,
        deleteClient,
        feedback,
        addFeedback,
        getFeedbackForUser,
        getFeedbackForPT,
        getAllFeedback,
        refreshUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
