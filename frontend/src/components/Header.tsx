import { NavLink } from "react-router-dom";

type HeaderProps = {
    first: string,
    second: string,
    redirect: string,
    redirectURL: string
}

export default function Header({first,second,redirect,redirectURL}:HeaderProps){
    return (
        <>
            <h2 className="text-2xl lg:text-3xl font-bold">{first}</h2>
            <p className="text-gray-500 font-semibold">{second} <NavLink to={redirectURL} className="underline">{redirect}</NavLink></p>
        </>
    )
}
