import { NextRequest, NextResponse } from 'next/server';

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error('Gagal dapat access token: ' + JSON.stringify(data));
  return data.access_token;
}

async function uploadToDrive(base64String: string, accessToken: string): Promise<string> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;
  const base64Data = base64String.split(',')[1];
  const mimeType = base64String.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
  const fileName = `bukti_${Date.now()}.jpg`;

  const metadata = JSON.stringify({ name: fileName, parents: [folderId] });
  const boundary = 'BOUNDARY_GARIMADANG';

  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n`),
    Buffer.from(base64Data),
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': multipartBody.length.toString(),
      },
      body: multipartBody,
    }
  );

  const uploadData = await uploadRes.json();
  if (!uploadData.id) throw new Error('Upload Drive gagal: ' + JSON.stringify(uploadData));

  // Set permission publik
  await fetch(`https://www.googleapis.com/drive/v3/files/${uploadData.id}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });

  return `https://drive.google.com/file/d/${uploadData.id}/view`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, bukti_pembayaran } = body;

    if (!orderId || !bukti_pembayaran) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // STEP 1: Upload ke Google Drive via OAuth
    const accessToken = await getAccessToken();
    const fileUrl = await uploadToDrive(bukti_pembayaran, accessToken);
    console.log('File URL:', fileUrl);

    // STEP 2: Kirim URL ke GAS untuk update spreadsheet
    const params = new URLSearchParams({
      action: 'upload_bukti',
      orderId,
      fileUrl,
    });

    const gasRes = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const gasText = await gasRes.text();
    let gasResult;
    try {
      gasResult = JSON.parse(gasText);
    } catch {
      gasResult = { success: false, raw: gasText };
    }

    return NextResponse.json(gasResult);

  } catch (err) {
    console.error('Error upload bukti:', err);
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(err) },
      { status: 500 }
    );
  }
}