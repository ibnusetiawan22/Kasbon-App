import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { deleteDebt, DebtServiceError, updateDebt } from "@/features/debts/service";

const routeParamsSchema = z.object({
  id: z.string().uuid("ID kasbon tidak valid."),
});

const getRequestBody = async (request: NextRequest): Promise<unknown> => {
  try {
    const body: unknown = await request.json();
    return body;
  } catch {
    throw new DebtServiceError("Body request tidak valid.", 400);
  }
};

const parseDebtId = async (
  params: Promise<{ id: string }>,
) => {
  const result = routeParamsSchema.safeParse(await params);

  if (!result.success) {
    throw new DebtServiceError("ID kasbon tidak valid.", 400);
  }

  return result.data.id;
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const debtId = await parseDebtId(context.params);
    const payload = await getRequestBody(request);
    const debt = await updateDebt(user?.id, debtId, payload);

    return NextResponse.json({ data: debt }, { status: 200 });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const debtId = await parseDebtId(context.params);
    await deleteDebt(user?.id, debtId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
