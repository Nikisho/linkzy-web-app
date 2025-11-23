import { supabaseAdmin } from "./supabase.ts";

export const insertUser = async (name:string, email:string) => {
    const { data: newUser, error: insertErr } = await supabaseAdmin
        .from("users")
        .insert({
            email: email,
            name: name,
            guest: true,
        })
        .select("id")
        .single();

    // Race condition: someone inserted the user first
    if (insertErr && insertErr.code === "23505") {
        const { data: raceUser } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", email)
            .single();
        return raceUser.id;
    } else if (insertErr) {
        throw insertErr;
    } else {
        return newUser.id;
    }
};
