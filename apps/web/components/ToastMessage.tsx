export default function ( {message, success, className} : {message: string, success: boolean, className?: string} ) {
    return (
        <div className={ className || "fixed bottom-5 right-5 text-wrap px-4 py-2 rounded-lg shadow-lg bg-white transition-opacity duration-300 text-2xl " + (success ? "text-green-500" : "text-red-500")}>{message}</div>
    )
}