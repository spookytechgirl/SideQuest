import JsonLd from "@/components/json-ld";
import { createPageStructuredData } from "@/lib/structured-data";

export default function PublicPageJsonLd(props) {
  return <JsonLd data={createPageStructuredData(props)} />;
}
