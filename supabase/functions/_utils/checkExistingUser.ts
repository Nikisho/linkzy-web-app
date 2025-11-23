import { supabaseAdmin } from "./supabase.ts";

export const checkExistingUser = async (email: string) => {
    const { data: existingUser, error: fetchErr } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

    if (fetchErr) {
        console.log("Error fetching user :", fetchErr);
    }

    if (existingUser) {
        return existingUser;
    }
    return null;
};
