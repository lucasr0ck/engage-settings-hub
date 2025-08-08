# 🎨 Configuração do Favicon - Maciel Agent

## 📍 Localização dos Arquivos

O favicon deve ser colocado na pasta `public/` do projeto:

```
public/
├── favicon.ico          # Favicon principal (32x32, 16x16)
├── favicon-16x16.png    # Favicon 16x16 (opcional)
├── favicon-32x32.png    # Favicon 32x32 (opcional)
├── apple-touch-icon.png # Ícone para dispositivos Apple (180x180)
└── android-chrome.png   # Ícone para Android (192x192)
```

## 🔧 Configuração no HTML

O favicon já está configurado no arquivo `index.html`:

```html
<head>
  <!-- Favicon principal -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Favicons para diferentes dispositivos -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  
  <!-- Android Chrome Icon -->
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome.png">
</head>
```

## 🎯 Especificações Recomendadas

### Favicon Principal (`favicon.ico`)
- **Tamanho**: 32x32 pixels (inclui 16x16)
- **Formato**: ICO
- **Cores**: Suporte a transparência
- **Design**: Logo "Maciel Agent" simplificado

### Apple Touch Icon (`apple-touch-icon.png`)
- **Tamanho**: 180x180 pixels
- **Formato**: PNG
- **Fundo**: Branco ou transparente
- **Design**: Logo completo com texto

### Android Chrome Icon (`android-chrome.png`)
- **Tamanho**: 192x192 pixels
- **Formato**: PNG
- **Fundo**: Branco ou transparente
- **Design**: Logo completo com texto

## 🛠️ Como Implementar

1. **Crie os ícones** nas dimensões especificadas
2. **Coloque na pasta `public/`** com os nomes corretos
3. **Teste localmente** com `npm run dev`
4. **Deploy** para verificar em produção

## 🎨 Sugestões de Design

### Cores da Marca
- **Primária**: Azul (#3B82F6)
- **Secundária**: Cinza escuro (#1F2937)
- **Acento**: Branco (#FFFFFF)

### Elementos Visuais
- **Logo**: "MA" estilizado
- **Ícone**: Agente/representante
- **Estilo**: Moderno e profissional

## 📱 Teste em Diferentes Dispositivos

Após implementar, teste em:
- ✅ Desktop (Chrome, Firefox, Safari)
- ✅ Mobile (iOS Safari, Android Chrome)
- ✅ Tablet (iPad, Android)
- ✅ PWA (se implementado)

## 🔄 Atualização

Para atualizar o favicon:
1. Substitua os arquivos na pasta `public/`
2. Limpe o cache do navegador
3. Teste em diferentes dispositivos
4. Deploy da aplicação 