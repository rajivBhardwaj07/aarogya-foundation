/** News/Blog post detail page. */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Seo from '../components/Seo.jsx';
import { Section, Loading, ErrorState } from '../components/ui.jsx';
import { LifelineDivider } from '../components/Lifeline.jsx';
import { getPost } from '../lib/api.js';
import { formatDate } from '../lib/format.js';

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPost(slug),
  });

  if (isLoading) return <Loading />;
  if (isError || !post)
    return (
      <Section>
        <ErrorState message="We could not find that story." onRetry={() => navigate('/events')} />
      </Section>
    );

  return (
    <>
      <Seo title={post.title} path={`/news/${post.slug}`} description={post.excerpt} image={post.coverImage} />
      <article>
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="h-72 w-full object-cover md:h-96" />
        )}
        <Section className="max-w-2xl">
          <Link to="/events" className="text-sm font-semibold text-healing hover:underline">
            ← Back to news
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-marigold">
            {post.category} · {post.readingTimeMin} min read
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">{post.title}</h1>
          <p className="mt-3 text-slate">
            By {post.author}
            {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
          </p>
          <LifelineDivider className="my-8" />
          <div className="prose-aarogya text-lg">
            {post.body.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Section>
      </article>
    </>
  );
}
