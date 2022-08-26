import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = 'https://xbuyvstzpmxepokuhqcm.supabase.co';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhidXl2c3R6cG14ZXBva3VocWNtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1Nzc2Mjk2MCwiZXhwIjoxOTczMzM4OTYwfQ.xPC2N51gOWijXGRVVg2rHEjXCGKBWielNaxV9qGDtIc';
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Get all entries
export const select = async <T>(table: string): Promise<T[]> => await supabase.from(table).select().then(i => i.data ? i.data : []);

// Find one entry
export const find = async <T>(table: string, key: string, value: string): Promise<T[]> => await (await supabase.from(table).select().eq(key, value).then(i => i.data ? i.data : []));

// Create a new entry
export const create = async <T extends {createdOn?: string}>(table: string, payload: T): Promise<T> => {
    payload.createdOn = new Date().getTime().toString();
    console.log('trying create of', table);
    return await supabase.from(table).insert(payload).throwOnError(true).then(i => i.data ? i.data[0] : null, err => console.log('an error occured', err));
};