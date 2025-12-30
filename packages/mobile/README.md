# Profunded Mobile App

App móvil React Native con Expo que incluye autenticación (login/signup) y navegación por tabs.

## 🚀 Características

- ✅ **Autenticación completa**: Login y Signup
- ✅ **Protección de rutas**: Solo usuarios autenticados acceden a las tabs
- ✅ **Navegación por tabs**: Home, Explorar, Perfil
- ✅ **Persistencia**: Los datos del usuario se guardan localmente
- ✅ **TypeScript**: Tipado completo
- ✅ **Expo Router**: Navegación basada en archivos

## 📁 Estructura del proyecto

```
app/
├── (auth)/              # Grupo de autenticación (sin tabs)
│   ├── login.tsx        # Pantalla de login
│   ├── signup.tsx       # Pantalla de registro
│   └── _layout.tsx      # Layout del grupo auth
├── (tabs)/              # Grupo de tabs (protegido)
│   ├── index.tsx        # Tab: Inicio
│   ├── two.tsx          # Tab: Explorar
│   ├── profile.tsx      # Tab: Perfil
│   └── _layout.tsx      # Layout de tabs
└── _layout.tsx          # Root layout (maneja autenticación)

contexts/
└── AuthContext.tsx      # Context de autenticación
```

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar la app

```bash
# Modo desarrollo
npm start

# Android
npm run android

# iOS (solo en Mac)
npm run ios

# Web
npm run web
```

### 3. Escanear QR

- Instala **Expo Go** en tu teléfono ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Escanea el código QR que aparece en la terminal

## 🔐 Flujo de Autenticación

### Sin autenticar

```
Usuario abre app → Login/Signup (sin tabs)
```

### Autenticado

```
Usuario se loguea → Tabs (Home, Explorar, Perfil)
```

### Logout

```
Usuario hace logout → Regresa a Login
```

## 🎯 Uso del Context de Autenticación

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, signup } = useAuth();

  // Login
  await login('email@example.com', 'password');

  // Signup
  await signup('email@example.com', 'password', 'Nombre');

  // Logout
  await logout();

  // Verificar usuario
  if (user) {
    console.log(user.email);
  }
}
```

## 🔄 Integrar con tu API

### En `contexts/AuthContext.tsx`:

Actualmente usa datos simulados. Para conectar con tu backend:

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('TU_API_URL/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  await AsyncStorage.setItem('token', data.token);
  setUser(data.user);
};

// Signup
const signup = async (email: string, password: string, name?: string) => {
  const response = await fetch('TU_API_URL/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  await AsyncStorage.setItem('token', data.token);
  setUser(data.user);
};
```

## 🎨 Personalización

### Cambiar colores

Edita `constants/Colors.ts`:

```typescript
export default {
  light: {
    tint: '#007AFF', // Color principal
    background: '#fff',
    // ...
  },
  dark: {
    // ...
  },
};
```

### Agregar más tabs

1. Crea un nuevo archivo en `app/(tabs)/nueva-tab.tsx`
2. Agrega la screen en `app/(tabs)/_layout.tsx`:

```tsx
<Tabs.Screen
  name="nueva-tab"
  options={{
    title: 'Nueva Tab',
    tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
  }}
/>
```

## 📱 Pantallas disponibles

### Login (`app/(auth)/login.tsx`)

- Email y password
- Validación de campos
- Navegación a signup
- Loading state

### Signup (`app/(auth)/signup.tsx`)

- Nombre, email, password, confirmar password
- Validaciones
- Navegación a login
- Loading state

### Perfil (`app/(tabs)/profile.tsx`)

- Avatar con inicial del usuario
- Información del usuario
- Opciones de configuración
- Botón de logout con confirmación

## 🔧 Comandos útiles

```bash
# Limpiar cache
npm start --clear

# Actualizar dependencias
npm update

# Ver logs
npx expo start --dev-client

# Build para producción
npx eas build --platform android
npx eas build --platform ios
```

## 📦 Dependencias principales

- `expo` - Framework principal
- `expo-router` - Navegación
- `@react-native-async-storage/async-storage` - Persistencia local
- `react-native` - Framework móvil
- `typescript` - Tipado

## 🚨 Troubleshooting

### Error: No se puede iniciar la app

```bash
# Limpiar cache y reinstalar
rm -rf node_modules
npm install
npm start --clear
```

### Error: AsyncStorage no funciona

```bash
# Reinstalar AsyncStorage
npm install @react-native-async-storage/async-storage
```

### Error: Expo Go no conecta

- Asegúrate de estar en la misma red WiFi
- Reinicia Expo Go
- Reinicia el servidor: `npm start --clear`

## 📝 Próximos pasos

- [ ] Conectar con API real (GraphQL/REST)
- [ ] Agregar validación de email
- [ ] Implementar "Olvidé mi contraseña"
- [ ] Agregar foto de perfil
- [ ] Implementar refresh tokens
- [ ] Agregar onboarding
- [ ] Agregar notificaciones push

## 🤝 Contribuir

Esta es una base sólida para tu app móvil. Puedes modificar cualquier cosa según tus necesidades.

## 📄 Licencia

MIT
