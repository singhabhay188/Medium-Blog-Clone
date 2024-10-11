export default function CardLoader(){
    return (
        <div role="status" className="max-w- animate-pulse max-w-[600px] mx-auto py-8 px-2">
            <div className="h-2.5 bg-gray-300 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-300 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-300 rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}