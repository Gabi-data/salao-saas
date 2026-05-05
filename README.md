# Agendei.app

Sistema de agendamento pra salões de beleza e barbearias.

Demo: [agendei-meusalao.vercel.app](https://agendei-meusalao.vercel.app)

---

## O que funciona

- Dono do salão se cadastra e faz login
- Cada salão tem um link público tipo `site.com/Barbaria_um`
- Cliente escolhe serviço, horário e agendar pelo link
- Dono e cliente recebem confirmação no WhatsApp
- Painel pra ver agendamentos do dia
- Dá pra cancelar agendamento se precisar
- Serviços e horários são configuráveis

---

## Tecnologias

| O que | Por que |
|-------|---------|
| Next.js 16 | Pra rodar o frontend e as rotas |
| Supabase | Banco + autenticação |
| Tailwind CSS | Pra estilizar sem perder tempo |
| Z-API | Envio de mensagens pro WhatsApp |
| Vercel | Deploy grátis que funciona |

---

## Como rodar local

```bash
git clone https://github.com/Gabi-data/salao-saas
cd salao-saas
npm install
