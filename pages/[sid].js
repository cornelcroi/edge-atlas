import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';

export async function getStaticPaths() {
  const paths = process.env.navbar.map((item) => ({
    params: {
      sid: item.link.replace('/', ''),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { sid } }) {
    const files = fs.readdirSync(`posts/${sid}`);
  
    const posts = files.map((fileName) => {
      const pid = sid + '+' + fileName.replace('.md', '');
      const readFile = fs.readFileSync(`posts/${sid}/${fileName}`, 'utf-8');
      const { data: frontmatter } = matter(readFile);
      return {
        pid,
        frontmatter,
      };
    });

    return {
      props: {
        posts,
      },
    };
  }


  export default function Section({ posts }) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0'>
        {posts.map(({ pid, frontmatter }) => (
          <div
            key={pid}
            className='border border-gray-200 m-2 rounded-xl overflow-hidden shadow-lg flex flex-col'
          >
            <Link href={`/post/${pid}`}>
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
