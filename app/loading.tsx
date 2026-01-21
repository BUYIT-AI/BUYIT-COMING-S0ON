'use client'
export default function Loading() {
    return (
        <div className="fixed top-0 left-0 bg-black h-full w-full z-10 flex justify-center items-center">
            <div className="animate-ping h-10 w-10 bg-white "></div>
        </div>
    )
}
