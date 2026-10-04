import { cache } from "react";
import { ARTICLES, Article } from "./journal";
import { imageUrl } from "./cloudinary";
import { DB_SCHEMA, getMotherDuckPool, isMotherDuckConfigured } from "./motherduck";

// Journal articles, editable in the admin (app/admin/journal).
// Like products: until the first edit, the site shows the articles written
// in lib/journal.ts. The first save copies those into the database, and
// from then on the database is the source of truth.

const T = `${DB_SCHEMA}.journal`;
export const canEditJournal = isMotherDuckConfigured;

let ready: Promise<unknown> | null = null;
function db() {
  const pool = getMotherDuckPool();
  ready ??= pool
    .query(`CREATE TABLE IF NOT EXISTS ${T} (slug VARCHAR PRIMARY KEY, sort_order INTEGER NOT NULL, data VARCHAR NOT NULL)`)
    .catch((err) => {
      ready = null;
      throw err;
    });
  return ready.then(() => pool);
}

type Row = { slug: string; sort_order: number; data: string };
async function rows(): Promise<Row[]> {
  const pool = await db();
  const { rows } = await pool.query<Row>(`SELECT slug, sort_order, data FROM ${T} ORDER BY sort_order ASC`);
  return rows;
}

/** Articles as stored, for the admin. */
export async function listArticlesForAdmin(): Promise<Article[]> {
  if (!isMotherDuckConfigured()) return ARTICLES;
  const r = await rows();
  return r.length ? r.map((x) => JSON.parse(x.data) as Article) : ARTICLES;
}

/** Articles for the public site. Falls back to the built-in ones if the database can't be reached. */
export const getArticles = cache(async (): Promise<Article[]> => {
  let list = ARTICLES;
  try {
    list = await listArticlesForAdmin();
  } catch (err) {
    console.error("Journal query failed, showing the built-in articles:", err);
  }
  return list.map((a) => ({ ...a, image: a.image ? imageUrl(a.image) : undefined }));
});

export async function getArticleBySlug(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug);
}

async function seedIfEmpty() {
  const pool = await db();
  const { rows: c } = await pool.query<{ n: number }>(`SELECT count(*) AS n FROM ${T}`);
  if (Number(c[0].n) > 0) return;
  for (let i = 0; i < ARTICLES.length; i++) {
    await pool.query(`INSERT INTO ${T} (slug, sort_order, data) VALUES ($1,$2,$3)`, [ARTICLES[i].slug, (i + 1) * 10, JSON.stringify(ARTICLES[i])]);
  }
}

/** Adds an article or replaces the one at `previousSlug`. New ones go first. */
export async function saveArticle(article: Article, previousSlug?: string): Promise<void> {
  await seedIfEmpty();
  const pool = await db();
  const all = await rows();
  const existing = previousSlug ? all.find((r) => r.slug === previousSlug) : undefined;
  if (all.some((r) => r.slug === article.slug && r.slug !== previousSlug)) {
    throw new Error("Another article already uses that title. Change the title slightly.");
  }
  const order = existing ? existing.sort_order : Math.min(0, ...all.map((r) => r.sort_order)) - 10;
  if (existing) await pool.query(`DELETE FROM ${T} WHERE slug = $1`, [previousSlug]);
  await pool.query(`INSERT INTO ${T} (slug, sort_order, data) VALUES ($1,$2,$3)`, [article.slug, order, JSON.stringify(article)]);
}

export async function deleteArticle(slug: string): Promise<void> {
  await seedIfEmpty();
  const pool = await db();
  await pool.query(`DELETE FROM ${T} WHERE slug = $1`, [slug]);
}
