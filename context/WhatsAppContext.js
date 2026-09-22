'use client';

import { createContext, useContext } from 'react';

const WHATSAPP_PHONE = '5531982939980';

const WhatsAppContext = createContext({
  phone: WHATSAPP_PHONE,
  buildLink: () => '',
});

export function WhatsAppProvider({ children }) {
  const buildLink = ({ nome, cidade, telefone, ocupacao, vinculo, empresa, rendaMensal, valorDesejado }) => {
    const n = nome ? nome.trim() : '[NOME]';
    const c = cidade ? cidade.trim() : '[CIDADE]';
    const t = telefone || '[TELEFONE]';
    const o = ocupacao ? ocupacao.trim() : '[OCUPACAO]';
    const valor = valorDesejado || '[VALOR]';

    let message = `Olá! Sou ${n}, sou ${o} (${vinculo || '[VÍNCULO]'}) e moro em ${c}.`;
    if (vinculo === 'PJ') {
      message += ` Minha empresa é ${empresa ? empresa.trim() : '[EMPRESA]'}, com renda mensal de R$ ${rendaMensal || '[RENDA]'}.`;
    }
    message += ` Gostaria de solicitar um empréstimo no valor de R$ ${valor}. Meu telefone é ${t}.`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  return (
    <WhatsAppContext.Provider value={{ phone: WHATSAPP_PHONE, buildLink }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  return useContext(WhatsAppContext);
}
