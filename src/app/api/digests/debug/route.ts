import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const envSecret = process.env.MAKE_DIGEST_SECRET;

  return NextResponse.json({
    hasAuthHeader: !!authHeader,
    authHeaderLength: authHeader?.length ?? 0,
    authHeaderPrefix: authHeader?.substring(0, 7) ?? null,
    hasEnvSecret: !!envSecret,
    envSecretLength: envSecret?.length ?? 0,
    match: authHeader === `Bearer ${envSecret}`,
  });
}
