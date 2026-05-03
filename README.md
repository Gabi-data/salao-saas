# Agendei.app — SaaS de Agendamento para Salões

Sistema completo de agendamento online desenvolvido do zero.

## Demo ao vivo
🔗 [agendei.vercel.app](https://agendei.vercel.app)

## Tecnologias
- Next.js 16 + TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS
- Z-API (WhatsApp)
- Vercel (Deploy)

## Funcionalidades
- Cadastro e login de donos de salão
- Página pública de agendamento por link único
- Confirmação automática por WhatsApp
- Dashboard com agenda do dia
- Gerenciamento de serviços e horários
- Sistema de cancelamento de agendamentos

## Rodando localmente
```bash
git clone https://github.com/Gabi-data/salao-saas
cd salao-saas
npm install
# configure o .env.local com suas chaves Supabase
npm run dev
```