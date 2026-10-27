'use client';

import { createContext, useContext } from 'react';

const WHATSAPP_PHONE = '5531982939980';

const WhatsAppContext = createContext({
  phone: WHATSAPP_PHONE,
  buildLink: () => '',
});

export function WhatsAppProvider({ children }) {
  const buildLink = ({ nome, cidade, telefone, ocupacao, empresa, motivo, rendaMensal, valorDesejado }) => {
    const n = nome ? nome.trim() : '[NOME]';
    const c = cidade ? cidade.trim() : '[CIDADE]';
    const t = telefone || '[TELEFONE]';
    const o = ocupacao ? ocupacao.trim() : '[OCUPACAO]';
    const e = empresa ? empresa.trim() : '[EMPRESA]';
    const m = motivo ? motivo.trim() : '[MOTIVO]';
    const renda = rendaMensal || '[RENDA]';
    const valor = valorDesejado || '[VALOR]';

    const message = `Olá! Sou ${n}, sou ${o} da empresa ${e} motivo ${m} e moro em ${c}. Trabalho como PJ. Minha renda mensal é de R$ ${renda} e gostaria de um valor de R$ ${valor}. Meu telefone é ${t}.`;

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
