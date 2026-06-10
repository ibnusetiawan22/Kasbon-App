import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { createDebt, DebtServiceError, listDebts } from "@/features/debts/service";

const getRequestBody = async (request: NextRequest): Promise<unknown> => {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    throw new DebtServiceError("Body request tidak valid.", 400);
  }
};

const createErrorResponse = (error: unknown) => {
  if (error instanceof DebtServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  return NextResponse.json(
    { error: "Terjadi kesalahan pada server." },
    { status: 500 },
  );
};

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const debts = await listDebts(user?.id, {
      status: request.nextUrl.searchParams.get("status") ?? undefined,
      type: request.nextUrl.searchParams.get("type") ?? undefined,
    });

    return NextResponse.json({ data: debts }, { status: 200 });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const payload = await getRequestBody(request);
    const debt = await createDebt(user?.id, payload);

    return NextResponse.json({ data: debt }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
