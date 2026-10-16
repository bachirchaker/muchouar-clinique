# Muchouar Clinique — Plateforme Médicale Moderne 🏥

**Muchouar Clinique** est une application web full-stack moderne conçue pour la gestion des patients, consultations et flux médicaux.

Développée avec l'écosystème le plus récent de **Next.js** et **React**, l'application met en œuvre une architecture modulaire, un typage strict et des normes de sécurité applicative avancées.

---

## 🚀 Stack Technique

- **Framework :** [Next.js](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Frontend :** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/) (Typage statique de bout en bout)
- **Base de données & ORM :** [Prisma ORM](https://www.prisma.io/) avec migrations & seeding
- **Sécurité & Authentification :** NextAuth / Auth.js, hachage bcrypt, validation de schémas avec [Zod](https://zod.dev/)
- **Composants & UI :** Lucide React, TanStack Table, Recharts

---

## 🛡️ Fonctionnalités & Sécurité

- 🔒 **Contrôle d'accès & Sessions :** Authentification robuste et protection des routes privées.
- 📋 **Validation stricte (Zero Trust) :** Tous les formulaires et mutations sont validés côté serveur via Zod.
- 🗄️ **Intégrité des données :** Schéma relationnel Prisma typé avec contraintes d'intégrité et transactions.
- 📊 **Tableaux de bord interactifs :** Visualisation des statistiques et suivi des consultations en temps réel.

---

## 🛠️ Installation & Démarrage

```bash
# 1. Cloner le dépôt
git clone https://github.com/bachirchaker/muchouar-clinique.git
cd muchouar-clinique

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
npx prisma generate
npx prisma db push

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.
