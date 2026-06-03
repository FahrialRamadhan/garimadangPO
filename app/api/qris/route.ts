import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const nominal =
      searchParams.get("amount");

    const qris =
      process.env.QRIS_STATIC;

    const response = await axios.get(
      "https://qr.ireng.uk/convert",
      {
        params: {
          qris,
          nominal,
        },
      }
    );

    return NextResponse.json(
      response.data
    );

  } catch (error: any) {

    console.error(
      error?.response?.data ||
      error.message
    );

    return NextResponse.json(
      {
        error: "Gagal generate QRIS",
        detail:
          error?.response?.data ||
          error.message,
      },
      { status: 500 }
    );
  }
}
