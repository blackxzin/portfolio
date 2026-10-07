# Lucas Gabriel — Portfólio

Portfólio pessoal em Next.js, React e TypeScript, com identidade hacker em preto e vermelho, projetos documentados e contatos profissionais.

## Desenvolvimento

```sh
npm ci
npm run dev
```

## Verificação e produção

```sh
npx tsc --noEmit
npm run build
npm start
```

## Conteúdo

- `src/content/profile.ts`: apresentação, stack, metas e contatos.
- `src/content/projects.ts`: projetos e estudos de caso.
- `src/app/globals.css`: identidade visual, responsividade e animações.
- `src/components/CyberCore.tsx`: núcleo 3D do hero, construído com CSS (sem modelos externos).

O núcleo possui controle de pausa, pausa automaticamente fora da tela ou com a aba oculta e respeita `prefers-reduced-motion`. O fundo WebGL existente usa fallback em CSS em dispositivos incompatíveis. O conteúdo principal permanece disponível sem JavaScript, sem tela de carregamento bloqueando a navegação.

As páginas de projetos e currículo continuam disponíveis nas URLs existentes. Os dados públicos do GitHub são consultados no servidor, com fallback quando a API está indisponível.

## Revisão visual

Confira a home em 390px, 768px e 1440px, menu mobile, navegação por teclado, controle de animação, preferência de movimento reduzido, páginas de projetos e impressão do currículo. A compilação e a checagem de tipos podem ser executadas sem navegador; a inspeção visual exige um navegador disponível no ambiente.
