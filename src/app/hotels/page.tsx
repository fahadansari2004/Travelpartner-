import { redirect } from "next/navigation";

// Hotels page removed - redirected to Packages
export default function HotelsPage() {
  redirect("/packages");
}
