"use client";
import { useSearchParams } from "next/navigation";

export default function BuchDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const author = searchParams.get("author");
  const img = searchParams.get("img");

  return (
    <div>
      Buch ID: {id} - Titel: {title} author: {author}
      <img src={img || ""} alt={title || ""} />
    </div>
  );
}
