import { useEffect, useState } from 'react';

interface NumberItem {
    number: string;
    label: string;
}

const RandomNumber = ({ finalNumber }: { finalNumber: string }) => {
    const [displayNumber, setDisplayNumber] = useState('0');

    useEffect(() => {
        let interval: number;

       
        const generateRandomNumber = () => {
            const random = Math.floor(Math.random() * 10000);
            console.log(`Número gerado: ${random}`); 
            setDisplayNumber(random.toString());
        };

        
        interval = window.setInterval(generateRandomNumber, 50);

       
        const timeout = setTimeout(() => {
            clearInterval(interval);
            setDisplayNumber(finalNumber);
        }, 3000);

       
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [finalNumber]);

    return (
        <h3 className="text-4xl font-bold text-rose-600 mb-2">
            {displayNumber}
        </h3>
    );
};

const NumbersSection = () => {
    const numbers: NumberItem[] = [
        { number: '10k+', label: 'Clientes Satisfeitas' },
        { number: '1.5k+', label: 'Produtos Vendidos/Mês' },
        { number: '98%', label: 'Avaliações Positivas' },
        { number: '24h', label: 'Atendimento' },
    ];

    return (
        <section className="py-20 bg-rose-50">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {numbers.map((item, index) => (
                        <div key={index} className="text-center">
                            <RandomNumber finalNumber={item.number} />
                            <p className="text-gray-600">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NumbersSection;
