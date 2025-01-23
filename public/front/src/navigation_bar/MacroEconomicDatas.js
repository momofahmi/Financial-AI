import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import "./MacroEconomicDatas.css";

const MacroEconomicDatas = () => {
  const [macroData, setMacroData] = useState(null);

  useEffect(() => {
    const fetchMacroData = async () => {
      try {
        const response = await fetch("/data.json"); // JSON dosyasını public'ten çek
        const data = await response.json();
        setMacroData(data);
      } catch (error) {
        console.error("Error fetching macroeconomy data:", error);
      }
    };

    fetchMacroData();
  }, []);

  if (!macroData) return null;

  const financialData = [
    { name: "USD", price: macroData.values.USD },
    { name: "EUR", price: macroData.values.EUR },
    { name: "GBP", price: macroData.values.GBP },
    {
      name: "Total Reserves",
      price: `${macroData.values.ToplamRezerv} Billion`,
    },
    { name: "Gold (Ounce)", price: `${macroData.values.OnsAltin} USD` },
    { name: "External Debt", price: `${macroData.values.BrutDisBorc} Billion` },
    { name: "Housing Index", price: `${macroData.values.KonutFiyatEndeksi}` },
    {
      name: "Year-End Inflation",
      price: `${macroData.values.SeneSonuEnflasyon}% `,
    },
    {
      name: "Overnight Rate",
      price: `${macroData.values.GecelikBorclanmaFaizi}%`,
    },
    {
      name: "Annual Interest Rate",
      price: `${macroData.values.OrtalamaYillikFaiz}% `,
    },
  ];

  return (
    <div className="marquee-container">
      <Marquee gradient={false} speed={50}>
        {financialData.map((item, index) => (
          <div key={index} className="marquee-item">
            <span className="stock-name">{item.name}</span>:
            <span className="stock-price">{item.price}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default MacroEconomicDatas;
