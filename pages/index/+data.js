import { redirect } from "vike/abort";

export async function data() {
  throw redirect("/texts");
}
