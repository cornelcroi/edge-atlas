export default function Layout({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-purple-400 mb-8 py-4'>
        <div className='container mx-auto flex justify-center'></div>
      </header>
      <main className='container mx-auto flex-1'>{children}</main>
      <footer className='bg-purple-500 mt-8 py-4'>
        <div className='container mx-auto flex justify-center text-white'>AWS@Edge - Under construction :)</div>
      </footer>
    </div>
  );
}
