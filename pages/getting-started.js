import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';

export async function getStaticProps() {
  const files = fs.readdirSync('posts/getting-started');

  const posts = files.map((fileName) => {
    //hacky
    const slug = 'getting-started--'+fileName.replace('.md', '');
    const readFile = fs.readFileSync(`posts/getting-started/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      posts,
    },
  };
}

export default function GettingStarted({ posts }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0'>
      {posts.map(({ slug, frontmatter }) => (
        <div
          key={slug}
          className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'
        >
          <Link href={`/post/${slug}`}>
            <a>
            <img
                style={{objectFit:'cover', margin:'auto', width:'385px', height:'164px'}}
                alt={frontmatter.title}
                src={`/${frontmatter.socialImage}`}
              />
              <h1 className='p-4'><b>{frontmatter.title}</b></h1>
              <p className='p-4'>{frontmatter.metaDesc}</p>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
