import Link from 'next/link';

export default function AdminPage() {
    return (
      <div className='flex justify-center items-center h-screen bg-[#0E0E17] font-rajdhaniSemiBold'>
        <div className='w-96 p-6 border-solid border-4 border-[#f75049]'> 
          <h1 className='text-[#f75049] text-2xl'>LOGIN</h1>
          <div className='mt-4'> 
            <div className='flex justify-between items-center mb-4'>
              <label for="username" className='text-[#f75049] mr-4'>USERNAME </label>
              <input 
              type="text" 
              id="username" 
              placeholder="enter username"
              className='border px-2 py-1 focus:outline-none focus:ring-0 bg-[#f75049] placeholder-[#0E0E17] border-[#f75049]  w-2/3'/>
            </div>
            <hr className='mt-4 border-[#0E0E17]'/>
            <div className='flex justify-between items-center mb-4'>
              <label for="password" className='text-[#f75049] mr-4'>PASSWORD </label>
              <input 
              type="text" 
              id="password" 
              placeholder="enter password"
              className='border px-2 py-1 focus:outline-none focus:ring-0 bg-[#f75049] placeholder-[#0E0E17] border-[#f75049] w-2/3'/>
            </div>
            <hr className='mt-4 border-[#0E0E17]'/>
            <Link href="/" className="bg-[#f75049]/60 text-[#f75049] py-1 px-2  hover:bg-[#f75049] hover:text-[#0e0e17] [border-solid border-2 border-[#f75049]">Go back to homepage</Link>
          </div>
        </div>
        <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
      </div>





      // <div className='flex justify-center items-center h-screen bg-indigo-600'>
      //   <h1>Test page</h1>
      //   <p>This routing works!</p>
      //   <Link href="/">Go back to homepage</Link>
      // </div>
    );
  }