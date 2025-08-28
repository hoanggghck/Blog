import { HTTP_STATUS } from '@/const/httpStatus';
import { apiService } from '@/lib/api-service';
import { setCookies } from '@/lib/cookies';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const sevenDays = 7 * 24 * 60 * 60;

export async function GET(request: Request) {

}
