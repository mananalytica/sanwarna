import ArticleForm from "../ArticleForm";

export default function NewArticle({ searchParams }: { searchParams: { error?: string } }) {
  return <ArticleForm error={searchParams.error} />;
}
