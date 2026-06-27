import { type NextRequest, type NextResponse } from 'next/server';
import { updateSession } from '@/database/proxy';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*[.](?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
