import Link from 'next/link';
// https://github.com/rebelchris/next-markdown-blog
export default function Layout({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-purple-400 mb-8 py-4'>
        <div className='container mx-auto flex justify-center'></div>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </header>
      <main className='container mx-auto flex-1'>{children}</main>
      <footer className='bg-purple-500 mt-8 py-4'>
        <div className='container mx-auto flex justify-center text-white'>AWS Edge Atlas - Under construction</div>
      </footer>
    </div>
  );
}
