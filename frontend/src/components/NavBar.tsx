import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

type navProps = {
    name: string
}

export default function NavBar({ name }: navProps) {
    const navigator = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    return (
        <nav className="bg-white border-gray-200 shadow-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="italic self-center text-2xl font-semibold whitespace-nowrap">Medium</span>
                </a>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-full mx-4" onClick={()=>{ navigator('/publish') }}>Publish</button>
                    <button type="button" className={`w-8 h-8 flex items-center justify-center text-white text-xl font-semibold bg-gray-800 rounded-full ${showMenu ? 'ring-4 ring-gray-400' : ''}`} onClick={()=>{ setShowMenu(p => !p)}}>
                        <span className="sr-only">Open user menu</span>
                        <p className="uppercase">{name[0]}</p>
                    </button>
                    <div className={`z-50 absolute top-[30px] max-xl:right-0 xl:left-1/2 xl:-translate-x-1/2 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow" id="user-dropdown ${showMenu ? '' : 'hidden'} border border-gray-400`}>
                        <div className="px-4 py-3">
                            <span className="block text-sm text-gray-900 capitalize">{name}</span>
                            <span className="block text-sm  text-gray-500 truncate">name@flowbite.com</span>
                        </div>
                        <ul className="py-2" aria-labelledby="user-menu-button">
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Earnings</a>
                            </li>
                            <li>
                                <NavLink to="/signout" className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">LOGOUT</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}