'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTracking } from '../hooks/useTracking';
import { useWhatsApp } from '../context/WhatsAppContext';
import { validatePhone, formatPhoneDisplay } from '../lib/phoneValidator';
import { formatCurrencyDigits, parseCurrencyDigits } from '../lib/currency';

export default function Page() {
  const tracking = useTracking();
  const { buildLink } = useWhatsApp();

  const [step, setStep] = useState(1);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');

  const [ocupacao, setOcupacao] = useState('');
  const [vinculo, setVinculo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [rendaMensal, setRendaMensal] = useState('');
  const [valorDesejado, setValorDesejado] = useState('');

  const [errors, setErrors] = useState({});

  const phoneDigits = useMemo(() => String(telefone || '').replace(/\D/g, ''), [telefone]);
  const phoneResult = useMemo(() => validatePhone(phoneDigits), [phoneDigits]);
  const phoneDisplay = useMemo(() => (phoneDigits ? formatPhoneDisplay(phoneDigits) : ''), [phoneDigits]);

  const emailValid = useMemo(() => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const valorDesejadoNumber = useMemo(() => parseCurrencyDigits(valorDesejado), [valorDesejado]);
  const rendaMensalNumber = useMemo(() => parseCurrencyDigits(rendaMensal), [rendaMensal]);

  const canAdvance = Boolean(
    nome.trim().length > 1 &&
    phoneResult.valid &&
    emailValid &&
    cidade.trim().length > 1
  );

  const canSubmit = Boolean(
    ocupacao.trim().length > 1 &&
    (vinculo === 'CLT' || vinculo === 'PJ') &&
    rendaMensalNumber > 0 &&
    valorDesejadoNumber > 0 &&
    (vinculo !== 'PJ' || empresa.trim().length > 1)
  );

  useEffect(() => {
    tracking.trackViewContent();
  }, [tracking]);

  const handleNext = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!phoneResult.valid) newErrors.telefone = phoneResult.error || 'Telefone inválido';
    if (email && !emailValid) newErrors.email = 'Email inválido';
    if (!cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleBack = () => {
    setErrors({});
    setStep(1);
  };

  const onSubmit = () => {
    const newErrors = {};
    if (!ocupacao.trim()) newErrors.ocupacao = 'Ocupação é obrigatória';
    if (vinculo !== 'CLT' && vinculo !== 'PJ') newErrors.vinculo = 'Selecione uma opção';
    if (!rendaMensalNumber) newErrors.rendaMensal = 'Renda mensal é obrigatória';
    if (!valorDesejadoNumber) newErrors.valorDesejado = 'Valor desejado é obrigatório';
    if (vinculo === 'PJ' && !empresa.trim()) newErrors.empresa = 'Nome da empresa é obrigatório';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const link = buildLink({
      nome: nome.trim(),
      cidade: cidade.trim(),
      telefone: phoneDisplay || phoneDigits,
      ocupacao: ocupacao.trim(),
      vinculo,
      empresa: empresa.trim(),
      rendaMensal,
      valorDesejado,
    });

    window.open(link, '_blank', 'noopener,noreferrer');

    if (vinculo === 'PJ') {
      tracking.trackContact({
        nome: nome.trim(),
        telefone: phoneDigits,
        email: email.trim() || undefined,
        cidade: cidade.trim(),
        valorDesejado: valorDesejadoNumber,
      });
    }
  };

  return (
    <main className="container">
      <section className="card">
        <div className="badge">
          <i className="fa-solid fa-lock" style={{ color: 'var(--gold)' }}></i>
          Atendimento rápido e seguro
        </div>
        <h1 className="h1">Fale com um especialista agora no WhatsApp</h1>
        <p className="subtitle">Preencha seus dados e receba uma resposta rápida, com atendimento humano e sigiloso.</p>

        <p className="step-indicator">Etapa {step} de 2</p>

        <div className="form" role="form" aria-label="Formulário de contato">
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="label" htmlFor="nome">
                  Nome *
                </label>
                <input
                  id="nome"
                  className={`input ${errors.nome ? 'input-error' : ''}`}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                />
                {errors.nome && <span className="error-message">{errors.nome}</span>}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="telefone">
                  Telefone *
                </label>
                <input
                  id="telefone"
                  className={`input ${errors.telefone ? 'input-error' : ''}`}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="DD + número (ex: 31987654321)"
                  autoComplete="tel"
                  inputMode="numeric"
                />
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                {phoneResult.valid && phoneDisplay && (
                  <span className="trust-text">
                    <i className="fa-solid fa-circle-check" style={{ color: 'var(--brand)' }}></i> {phoneDisplay}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="email">
                  Email (opcional)
                </label>
                <input
                  id="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  type="email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="cidade">
                  Cidade *
                </label>
                <input
                  id="cidade"
                  className={`input ${errors.cidade ? 'input-error' : ''}`}
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: Belo Horizonte"
                  autoComplete="address-level2"
                />
                {errors.cidade && <span className="error-message">{errors.cidade}</span>}
              </div>

              <div className="cta">
                <button
                  className="btn-whatsapp"
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance}
                >
                  PRÓXIMO PASSO
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label className="label" htmlFor="ocupacao">
                  Cargo/Função/Ocupação *
                </label>
                <input
                  id="ocupacao"
                  className={`input ${errors.ocupacao ? 'input-error' : ''}`}
                  value={ocupacao}
                  onChange={(e) => setOcupacao(e.target.value)}
                  placeholder="Ex: Cabeleireiro"
                  autoComplete="organization-title"
                />
                {errors.ocupacao && <span className="error-message">{errors.ocupacao}</span>}
              </div>

              <div className="form-group">
                <label className="label">Como você trabalha? *</label>
                <div className="radio-group">
                  <label className={`radio-option ${vinculo === 'CLT' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="vinculo"
                      value="CLT"
                      checked={vinculo === 'CLT'}
                      onChange={() => setVinculo('CLT')}
                    />
                    CLT (carteira assinada)
                  </label>
                  <label className={`radio-option ${vinculo === 'PJ' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="vinculo"
                      value="PJ"
                      checked={vinculo === 'PJ'}
                      onChange={() => setVinculo('PJ')}
                    />
                    PJ / Autônomo
                  </label>
                </div>
                {errors.vinculo && <span className="error-message">{errors.vinculo}</span>}
              </div>

              {vinculo === 'PJ' && (
                <div className="form-group">
                  <label className="label" htmlFor="empresa">
                    Nome da Empresa *
                  </label>
                  <input
                    id="empresa"
                    className={`input ${errors.empresa ? 'input-error' : ''}`}
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Ex: Studio Beleza Ltda"
                    autoComplete="organization"
                  />
                  {errors.empresa && <span className="error-message">{errors.empresa}</span>}
                </div>
              )}

              <div className="form-group">
                <label className="label" htmlFor="rendaMensal">
                  Renda Mensal *
                </label>
                <input
                  id="rendaMensal"
                  className={`input ${errors.rendaMensal ? 'input-error' : ''}`}
                  value={rendaMensal}
                  onChange={(e) => setRendaMensal(formatCurrencyDigits(e.target.value))}
                  placeholder="Ex: 3.500"
                  inputMode="numeric"
                />
                {errors.rendaMensal && <span className="error-message">{errors.rendaMensal}</span>}
              </div>

              <div className="form-group">
                <label className="label" htmlFor="valorDesejado">
                  Valor desejado *
                </label>
                <input
                  id="valorDesejado"
                  className={`input ${errors.valorDesejado ? 'input-error' : ''}`}
                  value={valorDesejado}
                  onChange={(e) => setValorDesejado(formatCurrencyDigits(e.target.value))}
                  placeholder="Ex: 15.000"
                  inputMode="numeric"
                />
                {errors.valorDesejado && <span className="error-message">{errors.valorDesejado}</span>}
              </div>

              <div className="cta">
                <button
                  className="btn-whatsapp"
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSubmit}
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  CHAMAR NO WHATSAPP
                </button>
                <button className="btn-back" type="button" onClick={handleBack}>
                  ← Voltar
                </button>
                <div className="trust">
                  <i className="fa-solid fa-lock" style={{ color: 'var(--gold)', fontSize: '11px' }}></i>
                  Seus dados são protegidos e usados apenas para contato e atendimento.
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Atendimento via WhatsApp. Todos os direitos reservados.
      </footer>
    </main>
  );
}
