import fs from 'fs';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';

export async function getStaticProps() {
  const files = fs.readdirSync('posts/application-performance');

  const posts = files.map((fileName) => {
    //hacky
    const slug = 'application-performance--'+fileName.replace('.md', '');
    const readFile = fs.readFileSync(`posts/application-performance/${fileName}`, 'utf-8');
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

export default function ApplicationPerformance({ posts }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0'>
      {posts.map(({ slug, frontmatter }) => (
        <div
          key={slug}
          className='border border-gray-200 m-2 rounded-xl overflow-hidden shadow-lg flex flex-col'
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




//style="position:absolute;top:0;left:0;bottom:0;right:0;box-sizing:border-box;padding:0;border:none;margin:auto;display:block;width:0;height:0;min-width:100%;max-width:100%;min-height:100%;max-height:100%;object-fit:cover"
//                 style={{position : 'absolute', top : '0', left:'0', bottom:'0', right:'0',boxSizing:'border-box', padding:'0',border:'none', margin:'auto', display:'block',width:'0', height:'0', minWidth:'100%', maxWidth:'100%', minHeight:'100%', maxHeight:'100%', objectFit:'cover'}}

//                data-nimg='intrinsic' style={{position : 'relative', top : '0', left:'0', bottom:'0', right:'0',boxSizing:'border-box', padding:'0',border:'none', margin:'auto', display:'block',width:'100', height:'100', minWidth:'100%', maxWidth:'100%', minHeight:'100%', maxHeight:'100%', objectFit:'cover'}}