import { useState } from 'react'

function NavLink({to, children}) {
    return <a href={to} className={`mx-4`}>
        {children}
    </a>
}

function MobileNav({open, setOpen}) {
    return (
        <div className={`absolute top-0 left-0 h-screen w-screen bg-purple-500 transform ${open ? "-translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out filter drop-shadow-md `}>
            <div className="flex items-center justify-center filter drop-shadow-md bg-white h-20"> {/*logo container*/}
                <a className="text-xl font-bold" href="/">AWS Edge Atlas</a>
            </div>
            <div className="flex flex-col ml-4 font-semibold">
                <a className="text-xl font-medium my-4" href="/getting-started" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>Getting Started</a>
                <a className="text-xl font-medium my-4" href="/application-performance" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>Application Performance</a>
                <a className="text-xl font-medium my-4" href="/application-security" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>Application Security</a>
                <a className="text-xl font-medium my-4" href="/observability" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>Observability</a>
                <a className="text-xl font-medium my-4" href="/management" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>Management</a>
                <a className="text-xl font-medium my-4" href="/video-streaming" onClick={() => setTimeout(() => {setOpen(!open)}, 100)}>Video Streaming</a>
            </div>  
        </div>
    )
}

export default function Navbar() {

    const [open, setOpen] = useState(false)
    return (
        <nav className=" bg-purple-500 flex filter drop-shadow-md px-4 py-4 h-20 items-center text-white">
            <MobileNav open={open} setOpen={setOpen}/>
            <div className="w-3/12 flex items-center">
                <a className="text-2xl font-bold" href="/">AWS Edge Atlas</a>
            </div>
            <div className="w-9/12 flex justify-end items-center">

                <div className="z-50 flex relative w-8 h-8 flex-col justify-between items-center md:hidden" onClick={() => {
                    setOpen(!open)
                }}>
                    {/* hamburger button */}
                    <span className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${open ? "rotate-45 translate-y-3.5" : ""}`} />
                    <span className={`h-1 w-full bg-black rounded-lg transition-all duration-300 ease-in-out ${open ? "w-0" : "w-full"}`} />
                    <span className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${open ? "-rotate-45 -translate-y-3.5" : ""}`} />
                </div>

                <div className="hidden md:flex font-semibold">
                    <NavLink to="/getting-started">Getting Started</NavLink>
                    <NavLink to="/application-performance">Application Performance</NavLink>
                    <NavLink to="/application-security">Application Security</NavLink>
                    <NavLink to="/observability">Observability</NavLink>
                    <NavLink to="/management">Management</NavLink>
                    <NavLink to="/video-streaming">Video Streaming</NavLink>
                </div>
            </div>
        </nav>
    )
}
