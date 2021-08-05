import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../supabaseApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user, error } = await supabase.auth.signUp({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user || error) {
      res.status(500).send({ message: error.message });
      return;
    }

    const { error: createProfileError } = await supabase
      .from("profiles")
      .insert({
        user_uuid: user.id,
        username: req.body.username,
      });

    if (createProfileError) {
      res.status(500).send({ message: "Error creating user" });
      return;
    }

    res.status(204).send(null);
  } else {
    res.status(404).send({ message: "Route not found" });
  }
}
