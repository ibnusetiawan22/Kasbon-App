import type { DebtListQuerySchema } from "@/schemas/debt.schema";
import type { AppSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type DebtInsert = Database["public"]["Tables"]["debts"]["Insert"];
type DebtUpdate = Database["public"]["Tables"]["debts"]["Update"];

export class DebtRepository {
  constructor(private readonly supabase: AppSupabaseServerClient) {}

  async listByUser(userId: string, filters: DebtListQuerySchema) {
    let query = this.supabase
      .schema("public")
      .from("debts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    if (filters.status === "paid") {
      query = query.not("settled_at", "is", null);
    }

    if (filters.status === "unpaid") {
      query = query.is("settled_at", null);
    }

    return query;
  }

  async create(payload: DebtInsert) {
    return this.supabase
      .schema("public")
      .from("debts")
      .insert(payload)
      .select("*")
      .single();
  }

  async updateById(id: string, userId: string, payload: DebtUpdate) {
    return this.supabase
      .schema("public")
      .from("debts")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .maybeSingle();
  }

  async deleteById(id: string, userId: string) {
    return this.supabase
      .schema("public")
      .from("debts")
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("user_id", userId);
  }
}