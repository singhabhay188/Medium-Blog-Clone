export default function CardLoaderSingle() {
    return (
        <>
            <div className="p-6 space-y-4 max-w-screen-lg mx-auto flex flex-col md:flex-row-reverse gap-4 md:gap-12 md:items-start animate-pulse">
                <div className="border border-gray-300 p-4 flex-1">
                    <div className="h-5 bg-gray-300 rounded-full w-36 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-48 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded-full w-32 mb-2"></div>
                </div>

                <div className="space-y-3 w-[60%] max-w-[600px]">
                    <div className="h-8 bg-gray-300 rounded-full w-72 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded-full w-40 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded-full w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded-full w-2/3"></div>
                    </div>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </>
    )
}