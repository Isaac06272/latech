import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface DigestRow {
  id: string;
  type: string;
  date: string;
  title: string;
  content: string;
  notion_page_id: string | null;
  source_data: unknown;
  updated_at: string;
}

// Initialize Supabase admin client (server-side only) - lazy initialization
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Supabase environment variables not configured');
    }

    supabaseAdmin = createClient(url, key);
  }
  return supabaseAdmin;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('digests')
      .select('*')
      .order('date', { ascending: false })
      .order('type', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Validate the secret header
    const authHeader = request.headers.get('authorization');
    const expectedSecret = `Bearer ${process.env.MAKE_DIGEST_SECRET}`;

    if (!authHeader || authHeader !== expectedSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the payload
    const body = await request.json();
    console.log('Digest payload received', {
      type: body.type,
      date: body.date,
      title: body.title,
      hasContent: !!body.content,
      notionPageId: body.notionPageId,
      hasSourceData: !!body.sourceData,
    });

    const { type, date, title, content, notionPageId, sourceData } = body;

    if (!type || !date || !title || !content) {
      return NextResponse.json({ success: false, error: 'Invalid digest payload' }, { status: 400 });
    }

    // 3. Upsert into Supabase
    console.log('Upserting to Supabase...');
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('digests')
      .upsert(
        {
          type,
          date,
          title,
          content,
          notion_page_id: notionPageId,
          source_data: sourceData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'type,date' } // Uses the unique constraint
      )
      .select()
      .single<DigestRow>();

    console.log('Supabase response', { hasData: !!data, error: error?.message });
    if (error) throw error;

    return NextResponse.json(
      { success: true, id: data.id, type: data.type, date: data.date, action: 'upserted' },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}