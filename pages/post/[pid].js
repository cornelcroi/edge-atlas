import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
import Form from '../../components/Form';
import React from 'react';
let files  = [];

function throughDirectory(directory) {
  fs.readdirSync(directory).forEach(File => {
      const absolute = path.join(directory, File);
      if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
      else return files.push(absolute);
  });
}

export async function getStaticPaths() {
  throughDirectory('posts');

  const paths = files.map((fileName) => ({
    params: {
      pid: fileName.replace('posts/', '').replace('.md', '').replace('/', '+')
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { pid } }) {
  const fileName = fs.readFileSync('posts/'+pid.replace('+','/')+'.md', 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
      pid,
    },
  };
}

export default function PostPage({ frontmatter, content, pid }) {
  const [showFeedback, toggleShowFeedback] = React.useState(false);
  
  function handleClick() {
    toggleShowFeedback(true);
  }

  function renderFeedback() {
    if (showFeedback) {
      return <Form pid={pid}></Form>
    } else {
      return <button onClick={handleClick} className='m-1 flex-grow bg-purple-400 hover:bg-purple-800 duration-300 text-white shadow p-2 rounded-r'> Give us your feedback</button>
    }
  }

  return (
    <div className='prose mx-auto justify-center'>
      <h1 className='m-5'>{frontmatter.title}</h1>
      <div className='m-5' dangerouslySetInnerHTML={{ __html: md().render(content) }} />
      <footer className='bg-purple-200 mt-8 py-4'>
        <div className='container mx-auto flex justify-center text-purple'>
          {renderFeedback()}
        </div>
      </footer>
    </div>
  );
}


