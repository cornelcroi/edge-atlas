import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
let files  = [];

function throughDirectory(directory) {
  fs.readdirSync(directory).forEach(File => {
      const Absolute = path.join(directory, File);
      if (fs.statSync(Absolute).isDirectory()) return throughDirectory(Absolute);
      else return files.push(Absolute);
  });
}

export async function getStaticPaths() {
  throughDirectory('posts');

  const paths = files.map((fileName) => ({
    params: {
      //hacky
      slug: fileName.replace('posts/', '').replace('/', '--').replace('.md', ''),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug, originalFileName } }) {
  //hacky
  const fileName = fs.readFileSync('posts/'+slug.replace('--','/')+'.md', 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
      slug,
    },
  };
}

export default function PostPage({ frontmatter, content, slug }) {
  return (
    <div className='prose mx-auto justify-center'>
      <h1 className='m-5'>{frontmatter.title}</h1>
      <div className='m-5' dangerouslySetInnerHTML={{ __html: md().render(content) }} />
      <footer className='bg-purple-200 mt-8 py-4'>
        <div className='container mx-auto flex justify-center text-white'><a href={`mailto:aws-edge-atlas@amazon.com?Subject=feedback on ${slug}`}>Provide us with feedback</a></div>
      </footer>
    </div>
  );
}


