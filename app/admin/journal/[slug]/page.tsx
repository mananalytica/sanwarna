import { notFound } from "next/navigation";
import { listArticlesForAdmin } from "@/lib/journalStore";
import ArticleForm from "../ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticle({ params, searchParams }: { params: { slug: string }; searchParams: { error?: string } }) {
  const article = (await listArticlesForAdmin()).find((a) => a.slug === params.slug);
  if (!article) notFound();
  return <ArticleForm article={article} error={searchParams.error} />;
}
