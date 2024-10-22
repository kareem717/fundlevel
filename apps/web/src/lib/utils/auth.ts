import { createClient } from "@/lib/utils/supabase/server";
import supabaseClient from "@/lib/utils/supabase/client";

export const getServerUser = async () => {
	const sb = await createClient();
	return await sb.auth.getUser();
};

export const getClientSession = async () => {
	const sb = supabaseClient();
	return await sb.auth.getSession();
};