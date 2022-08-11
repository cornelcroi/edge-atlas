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
    },
  };
}

export default function PostPage({ frontmatter, content }) {
  return (
    <div className='m-5'>
      <h1>{frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
    </div>
  );
}
