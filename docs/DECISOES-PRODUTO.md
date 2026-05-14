# TNL — Decisões de Produto
**Documento vivo — atualizado em 13/05/2026**

---

## ✅ Decisões tomadas em 13/05/2026

### Stack e roadmap
- **Stack v1 mantida** para todas as features estáticas (destaque strip, pills de categoria, seção B2B)
- **Gatilho da v2:** primeiro pagamento online do plano Destaque — só inicia a migração para Next.js + Supabase quando houver transação online real
- Até lá: cadastros e pagamentos feitos manualmente pela equipe TNL (PIX + controle no Sheets)

### Seção B2B — itens pendentes
- **Mídia kit:** criar documento (PDF ou página) com alcance, audiência e formatos de parceria — item obrigatório antes de lançar a seção B2B no site
- Seção B2B planejada na home entre "Quem Somos" e "Notícias" (ver análise de monetização nesta sessão)

---

## ✅ Decisões tomadas em 11/05/2026

### Controle operacional de parceiros
- **Ferramenta:** Google Sheets no Google Drive (não Airtable)
- **Pasta Drive:** https://drive.google.com/drive/folders/15tq-GjpakaQSJd6YgX1AZObytx3PB_7a
- **Planilha ativa:** `temnolimao-negocios-2026-05-07-final.csv`
- **Estrutura:** 14 colunas — ID / Status / Nome / Categoria / TipoNegócio / DataFormulário / DataPagamento / TipoPagamento / EntradaSite / Telefone / Site / Instagram / Endereço / HorárioFuncionamento
- **TipoNegócio:** `Parceiro` ou `Recorrente`
- **TipoPagamento:** `PIX` ou `MensalTNL`
- **DataFormulário:** preenchido automaticamente via Tally → Google Sheets (negócios #44+ em diante)
- **Separação financeira:** aba separada na mesma planilha para o financeiro (ver seção abaixo)

### Integração Tally → Google Sheets
- Tally alimenta o Sheets automaticamente a cada novo formulário submetido
- Campos automáticos: Nome, Categoria, Telefone, Instagram, Site, Endereço, HorárioFuncionamento, DataFormulário
- Campos manuais (equipe TNL): ID, Status, TipoNegócio, DataPagamento, TipoPagamento, EntradaSite
- **Status pendente:** configurar a integração no painel do Tally

### Separação financeira (sugestão do financeiro — aprovada)
- **Aba Operacional:** dados completos do parceiro (uso da equipe TNL)
- **Aba Financeiro:** somente ID, Nome, TipoNegócio, TipoPagamento, DataPagamento, Vencimento, Valor, StatusFinanceiro
- Ambas na mesma planilha do Drive, acessadas por pessoas diferentes

### E-mails financeiros — Conta Azul ✅ confirmado
- **Decisão:** e-mails financeiros (recibos, confirmações de pagamento, cobranças) saem pelo **Conta Azul**
- E-mails operacionais do site (boas-vindas, listagem publicada, reset de senha) saem pelo **Resend** na v2
- Essa separação é consistente com a sugestão do financeiro de manter a parte financeira "apartada" do site
- **Próximo passo:** confirmar com o financeiro quais documentos ele quer que saiam pelo Conta Azul (NF, recibo, cobrança de renovação?)

---

## 1. Método de login (somente para negócios parceiros)

> **Premissa confirmada:** usuários comuns navegam sem login. Só negócios cadastrados precisam de conta.

### Opção A — E-mail + senha
- Familiar para qualquer pessoa
- O negócio cria senha na primeira vez e loga normalmente depois
- **Prós:** zero dependência de terceiros, funciona offline, fácil de implementar no Supabase
- **Contras:** mais atrito no cadastro, suporte a "esqueci a senha", senhas fracas

### Opção B — Magic link (link por e-mail)
- O negócio informa o e-mail, recebe um link e clica para entrar — sem senha
- **Prós:** menos atrito, sem suporte a esqueci-senha, mais seguro que senhas fracas
- **Contras:** depende de acesso ao e-mail na hora do login; dono de lojinha pode não ter e-mail ativo no dia a dia; entrega pode cair no spam

### Opção C — Google OAuth (login com Google)
- O negócio entra com a conta Google
- **Prós:** menor atrito possível, sem cadastro de senha, muito familiar
- **Contras:** dependência do Google, o negócio precisa ter conta Google (nem sempre é o caso para pequenos comerciantes do bairro)

### Opção D — WhatsApp OTP (código via WhatsApp)
- O negócio informa o número de celular, recebe código via WA e entra
- **Prós:** altíssima taxa de entrega, canal que 100% dos comerciantes usam, zero atrito para quem não tem e-mail ativo
- **Contras:** custo de API (Twilio, Z-API ou similar), mais complexidade de implementação, latência variável na entrega do código

### Opção E — Cadastro + pagamento em um único link
- O negócio acessa um link de checkout (gerado pela equipe TNL ou via formulário), paga via PIX ou cartão, e o sistema cria a conta automaticamente ao confirmar o pagamento
- **Prós:** jornada de onboarding em uma etapa só, sem atrito de cadastro separado, funciona bem com AbacatePay e Mercado Pago
- **Contras:** se o pagamento falhar, a conta não é criada (tratar edge case); o negócio ainda precisa de um e-mail para receber credenciais
- **Nota:** essa opção não é excludente — pode ser combinada com qualquer método de login acima

### Recomendação para discussão
**E-mail + senha (Opção A) como base, com Opção E no fluxo de onboarding.**
Motivo: pequenos comerciantes do Limão nem sempre têm celular com WA habilitado para API, e magic link depende de caixa de e-mail ativa. Uma senha simples é o mínimo denominador comum. O link de pagamento gerando a conta (Opção E) elimina um passo do processo comercial.

---

## 2. Gateway de pagamento + modelo de checkout

### Comparativo de gateways

| | AbacatePay | Mercado Pago | Stripe |
|---|---|---|---|
| **Taxa PIX** | R$0,80 fixo | ~1,99% | Não opera no Brasil nativamente |
| **Taxa cartão** | ~2,5% | ~3,5–4,5% | ~2,9% + $0,30 |
| **Reconhecimento pelo cliente** | Baixo | Altíssimo | Médio (B2B) |
| **API / docs** | Moderna, voltada a SaaS | Completa mas verbosa | Referência mundial, melhor DX |
| **Checkout embedded** | Sim (white-label) | Sim (Brick) | Sim (Elements) |
| **PIX recorrente** | Sim (foco principal) | Sim | N/A |
| **Webhooks** | Simples e confiáveis | Confiáveis | Os melhores do mercado |
| **Setup** | Rápido | Médio | Médio |

### Modelo de checkout

**Embedded (dentro do site)**
- O formulário de pagamento fica dentro da plataforma TNL
- **Prós:** melhor UX, marca não sai do ar, mais controle visual
- **Contras:** mais complexidade técnica, responsabilidade de PCI maior

**Redirect (vai para a página do gateway)**
- O negócio é redirecionado para MP ou AbacatePay para pagar
- **Prós:** implementação mais rápida, toda responsabilidade PCI é do gateway
- **Contras:** quebra a jornada, parece menos profissional

### Facilidade de implementação
| Gateway | Dificuldade | Por quê |
|---|---|---|
| **AbacatePay** | ⭐⭐ Fácil | API moderna, documentação clara, foco em PIX recorrente, menos casos de borda |
| **Mercado Pago** | ⭐⭐⭐ Médio | API mais extensa, mais opções = mais configuração, webhooks mais verbosos |
| **Stripe** | ⭐⭐⭐ Médio | Melhor DX do mercado, mas não opera PIX nativamente no Brasil |
| **AbacatePay + MP** | ⭐⭐⭐⭐ Complexo | Dois gateways = duas integrações, dois padrões de webhook, mais código |

### Recomendação para discussão
**AbacatePay como único gateway no MVP.**
Motivo: R$0,80 fixo é previsível, vantajoso para planos de R$49–99/mês, implementação mais rápida. Se aparecer demanda por cartão, adiciona MP na v2.1 — não precisa estar no MVP.

**Checkout:** redirect agora (lança rápido, toda responsabilidade PCI fica no gateway). Migrar para embedded na v2 quando houver volume.

**Impacto financeiro comparado:**
- AbacatePay: R$0,80/transação → em 49 parceiros = R$39,20/mês em taxas
- Mercado Pago ~1,99% PIX: em R$49/mês × 49 parceiros → R$47,85/mês em taxas
- Diferença pequena hoje, mas escala com volume

---

## 3. Planos e preços ✅ definido em 11/05/2026

> Foco exclusivo em negócios. 2 tiers. Preços validados.

| Plano | Preço | O que inclui |
|---|---|---|
| **Parceiro** | R$49,90/mês | Card no diretório: logo, nome, categoria, endereço, horário, WA, Instagram, site. Aparece na busca e filtros de categoria. |
| **Destaque** | R$99,90/mês | Tudo do Parceiro + posição prioritária na categoria + badge "Destaque" + aparece na seção "Destaques do Limão" na home |

**Pitch de venda:**
> *"Pelo Parceiro você está no mapa. Pelo Destaque você aparece na frente e na vitrine do bairro."*

### Seção "Destaques do Limão" — a criar
- **Hoje:** existe carrossel genérico de parceiros
- **O que falta:** seção visual dedicada para negócios do plano Destaque
- **v1 agora:** curadoria manual no HTML pelo admin
- **v2:** automático — quem é Destaque aparece sem intervenção

### O que NÃO fazer
- ❌ Terceiro tier (Premium com landing page) — guarda para v2
- ❌ Taxa de setup — aumenta atrito
- ❌ Plano gratuito — desvaloriza o produto

### Perguntas ainda abertas para o sócio
1. Desconto para pagamento anual? (ex: R$499/ano Parceiro · R$999/ano Destaque — ~2 meses grátis)
2. Os 49 atuais — período de carência antes de migrar para plano pago?

---

## 4. Estratégia Casa Verde

> **Contexto:** Casa Verde é bairro vizinho ao Limão. A pergunta é como expandir o formato TNL para lá.

### Opção A — Operação própria (como o TNL hoje)
- Renato + sócio cadastram os negócios, vendem, gerenciam tudo
- **Prós:** controle total, qualidade garantida, margem inteira
- **Contras:** dobra a carga operacional, sem escala, o tempo de vocês é o gargalo

### Opção B — Franquia operacional (parceiro comercial local)
- Vocês vendem a plataforma para uma pessoa da Casa Verde
- Essa pessoa fica responsável por vender, cadastrar e relacionar com os negócios locais
- TNL fica com gestão técnica + % da receita; o parceiro fica com o restante
- **Prós:** escala sem aumentar carga de vocês, parceiro tem contexto local, modelo replicável para outros bairros
- **Contras:** perda de controle de qualidade, parceiro pode sumir, vocês precisam de contrato claro, divisão de receita reduz margem
- **Split sugerido para discutir:** 30% parceiro / 70% TNL? Ou flat fee mensal para o parceiro?

### Opção C — Aguardar v2 (multi-tenant automático)
- Na v2 com Next.js + Supabase, cada bairro seria um subdomínio (`casaverde.temnolimao.com.br`)
- Novos bairros sem código novo — só configuração no banco
- **Prós:** escala infinita tecnicamente, zero dívida técnica
- **Contras:** depende da v2 estar pronta (~3–4 meses), nenhuma receita de Casa Verde nesse período

### Opção D — Repo temporário com prazo de aposentadoria
- Clonar o site atual do TNL para Casa Verde agora (como o `CLONAR-PARA-CASA-VERDE.md` já descreve)
- Definir data de migração para v2 (ex: quando v2 ficar pronta, migra tudo)
- **Prós:** receita começa agora, aprendizado do mercado de Casa Verde antes de investir pesado
- **Contras:** cada melhoria no TNL precisa ser replicada manualmente no clone, gera dívida técnica

### Recomendação para discussão
**Combinar Opção B + Opção D agora, evoluindo para Opção C na v2.**
Motivo: lançar Casa Verde agora com um clone simples (Opção D) via um parceiro local (Opção B) gera receita e valida o modelo sem sobrecarregar vocês dois. Quando a v2 ficar pronta, o clone é aposentado e o parceiro migra para o multi-tenant. Isso também serve de prova de conceito para outros bairros.

---

## Resumo das decisões + próximos passos

| Decisão | Status | Recomendação |
|---|---|---|
| Login | ❓ Em aberto | E-mail + senha + onboarding via link de pagamento |
| Gateway | ❓ Em aberto | AbacatePay (PIX) + MP (cartão) |
| Checkout | ❓ Em aberto | Redirect agora, embedded na v2 |
| Planos e preços | ❓ Em aberto | Básico R$49 / Destaque R$99 / Premium R$199 |
| Casa Verde | ❓ Em aberto | Clone agora + parceiro local, migrar para v2 depois |

**Nada de código de pagamento, auth ou Casa Verde antes de fechar essas decisões.**
