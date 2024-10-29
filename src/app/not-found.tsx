// app/not-found.tsx
import Link from 'next/link';

const Custom404 = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-[800px]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 800 400"
                    className="w-full h-auto"
                >
                    {/* Background */}
                    <rect width="800" height="400" fill="#fff" />

                    {/* Decorative curves */}
                    <path
                        d="M0 300 Q 400 200 800 300"
                        stroke="#F0B1CC"
                        strokeWidth="2"
                        fill="none"
                    />
                    <path
                        d="M0 310 Q 400 210 800 310"
                        stroke="#F0B1CC"
                        strokeWidth="2"
                        fill="none"
                    />

                    {/* Number 4 */}
                    <path
                        d="M150 80 L150 220 L250 220 M200 80 L200 280"
                        fill="none"
                        stroke="#540002"
                        strokeWidth="25"
                        strokeLinecap="round"
                    />

                    {/* Number 0 */}
                    <ellipse
                        cx="400"
                        cy="180"
                        rx="70"
                        ry="100"
                        fill="none"
                        stroke="#540002"
                        strokeWidth="25"
                    />

                    {/* Number 4 */}
                    <path
                        d="M550 80 L550 220 L650 220 M600 80 L600 280"
                        fill="none"
                        stroke="#540002"
                        strokeWidth="25"
                        strokeLinecap="round"
                    />

                    {/* Text */}
                    <text
                        x="400"
                        y="350"
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                        fontSize="24"
                        fill="#540002"
                    >
                        Ops! Página não encontrada
                    </text>

                    {/* Decorative lace elements */}
                    <path
                        d="M50 380 Q 100 360 150 380 Q 200 400 250 380"
                        stroke="#F0B1CC"
                        strokeWidth="3"
                        fill="none"
                    />
                    <path
                        d="M550 380 Q 600 360 650 380 Q 700 400 750 380"
                        stroke="#F0B1CC"
                        strokeWidth="3"
                        fill="none"
                    />

                    {/* Decorative hearts */}
                    <path
                        d="M380 50 C380 40 370 30 360 30 C350 30 340 40 340 50 Q360 70 380 50"
                        fill="#F0B1CC"
                    />
                    <path
                        d="M460 50 C460 40 450 30 440 30 C430 30 420 40 420 50 Q440 70 460 50"
                        fill="#F0B1CC"
                    />

                    {/* Small decorative elements */}
                    <circle cx="100" cy="100" r="5" fill="#F0B1CC" />
                    <circle cx="700" cy="100" r="5" fill="#F0B1CC" />
                    <circle cx="150" cy="350" r="5" fill="#F0B1CC" />
                    <circle cx="650" cy="350" r="5" fill="#F0B1CC" />
                </svg>
            </div>

            <Link
                href="/"
                className="mt-2 px-6 py-3 bg-[#540002] text-white rounded-md hover:bg-opacity-90 transition-opacity"
            >
                Voltar para Home
            </Link>
        </div>
    );
};

export default Custom404;
