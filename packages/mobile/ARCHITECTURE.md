# Arquitectura de Profunded Mobile

## 📊 Diagrama de flujo de autenticación

```
┌─────────────────────────────────────────────────────────────┐
│                     App Initialization                       │
│                                                              │
│  1. Cargar fuentes                                          │
│  2. Inicializar AuthProvider                                │
│  3. Cargar usuario de AsyncStorage                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  ¿Usuario      │
              │  autenticado?  │
              └────┬───────┬───┘
                   │       │
            NO ────┘       └──── SÍ
            │                   │
            ▼                   ▼
   ┌────────────────┐   ┌──────────────┐
   │  (auth) Group  │   │ (tabs) Group │
   │                │   │              │
   │  • Login       │   │  • Home      │
   │  • Signup      │   │  • Explore   │
   └────────────────┘   │  • Profile   │
                        └──────────────┘
```

## 🔐 Sistema de Autenticación

### AuthContext (`contexts/AuthContext.tsx`)

Maneja todo el estado de autenticación:

```typescript
interface AuthContextType {
  user: User | null;           // Usuario actual
  isLoading: boolean;          // Estado de carga
  login: (email, pass) => Promise<void>;
  signup: (email, pass, name?) => Promise<void>;
  logout: () => Promise<void>;
}
```

### Persistencia con AsyncStorage

```
┌─────────────────────┐
│   AsyncStorage      │
├─────────────────────┤
│ key: "user"         │ → Información del usuario
│ key: "token"        │ → JWT token (para futuro)
└─────────────────────┘
```

## 🛣️ Sistema de Rutas

### Expo Router - File-based routing

```
app/
├── _layout.tsx                 [Root Layout]
│   ├── AuthProvider wrapper
│   └── Protección de rutas
│
├── (auth)/                     [Auth Group - Público]
│   ├── _layout.tsx             Stack navigation
│   ├── login.tsx               /login
│   └── signup.tsx              /signup
│
└── (tabs)/                     [Tabs Group - Protegido]
    ├── _layout.tsx             Tab navigation
    ├── index.tsx               /(tabs)
    ├── two.tsx                 /(tabs)/two
    └── profile.tsx             /(tabs)/profile
```

## 🔄 Flujo de Navegación

### 1. Usuario abre la app por primera vez

```
App Start
    ↓
AuthProvider carga
    ↓
AsyncStorage.getItem('user') → null
    ↓
isLoading = false, user = null
    ↓
RootLayoutNav detecta: !user && !inAuthGroup
    ↓
router.replace('/login')
    ↓
Usuario ve Login Screen
```

### 2. Usuario hace login

```
Usuario ingresa credenciales
    ↓
Presiona "Iniciar Sesión"
    ↓
handleLogin()
    ↓
AuthContext.login(email, password)
    ↓
API call (o mock)
    ↓
AsyncStorage.setItem('user', userData)
    ↓
setUser(userData)
    ↓
RootLayoutNav detecta: user && inAuthGroup
    ↓
router.replace('/(tabs)')
    ↓
Usuario ve Home Screen con tabs
```

### 3. Usuario hace logout

```
Usuario presiona "Cerrar Sesión"
    ↓
Confirma en Alert
    ↓
AuthContext.logout()
    ↓
AsyncStorage.removeItem('user')
AsyncStorage.removeItem('token')
    ↓
setUser(null)
    ↓
RootLayoutNav detecta: !user && !inAuthGroup
    ↓
router.replace('/login')
    ↓
Usuario ve Login Screen
```

## 🎯 Componentes clave

### Root Layout (`app/_layout.tsx`)

```typescript
// 1. Wrap everything con AuthProvider
<AuthProvider>
  <RootLayoutNav />
</AuthProvider>

// 2. Protección de rutas
useEffect(() => {
  if (!user && !inAuthGroup) router.replace('/login');
  if (user && inAuthGroup) router.replace('/(tabs)');
}, [user, segments]);
```

### Auth Screens

```
Login                           Signup
┌──────────────┐               ┌──────────────┐
│ Bienvenido   │               │ Crear Cuenta │
│              │               │              │
│ [Email    ]  │               │ [Nombre   ]  │
│ [Password ]  │               │ [Email    ]  │
│              │               │ [Password ]  │
│ [Iniciar]    │               │ [Confirmar]  │
│              │               │              │
│ ¿No tienes   │               │ [Registrar]  │
│ cuenta?      │               │              │
│ [Regístrate] │               │ ¿Ya tienes   │
└──────────────┘               │ cuenta?      │
                               │ [Inicia]     │
                               └──────────────┘
```

### Tabs Layout

```
┌─────────────────────────────────────┐
│          Contenido de Tab            │
│                                      │
│                                      │
│                                      │
└─────────────────────────────────────┘
┌──────────┬──────────┬──────────────┐
│ 🏠 Inicio│ 🧭 Expl. │ 👤 Perfil    │
└──────────┴──────────┴──────────────┘
```

## 🔧 Estados de la aplicación

### Loading States

```typescript
// 1. App loading (fonts, assets)
if (!loaded) return null;

// 2. Auth loading (checking AsyncStorage)
if (isLoading) return null; // O <LoadingScreen />

// 3. Action loading (login, signup, logout)
const [isLoading, setIsLoading] = useState(false);
```

### User States

```typescript
// No autenticado
user = null → Ver login/signup

// Autenticado
user = { id, email, name } → Ver tabs

// Loading
isLoading = true → Ver loading o null
```

## 📡 Integración con API (Próximo paso)

### 1. Crear servicio de API

```typescript
// services/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  
  signup: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },
};
```

### 2. Actualizar AuthContext

```typescript
const login = async (email: string, password: string) => {
  const data = await authAPI.login(email, password);
  
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  await AsyncStorage.setItem('token', data.token);
  
  setUser(data.user);
};
```

### 3. Agregar interceptor para token

```typescript
// services/api.ts
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
```

## 🎨 Temas y Estilos

La app soporta modo claro y oscuro automáticamente:

```typescript
// Detectar tema
const colorScheme = useColorScheme();

// Usar colores del tema
import Colors from '@/constants/Colors';
const color = Colors[colorScheme ?? 'light'].tint;
```

## 🔒 Seguridad

### Mejores prácticas implementadas:

- ✅ No guardar passwords en AsyncStorage
- ✅ Usar HTTPS en producción
- ✅ Validar inputs antes de enviar
- ✅ Limpiar storage al logout
- ✅ Proteger rutas con autenticación

### Por implementar:

- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Biometric authentication
- [ ] Encriptar AsyncStorage
- [ ] Certificate pinning

## 📱 Estructura de datos

### User Object

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  // Agregar según tu backend:
  // avatar?: string;
  // role?: string;
  // createdAt?: Date;
}
```

### AsyncStorage Keys

```typescript
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "Juan Pérez"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🚀 Deployment

### Build para Android

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform android
```

### Build para iOS

```bash
# Build (requiere cuenta Apple Developer)
eas build --platform ios
```

## 📝 Testing

### Flujos a testear:

1. ✅ Login exitoso
2. ✅ Login con credenciales inválidas
3. ✅ Signup exitoso
4. ✅ Signup con email existente
5. ✅ Persistencia después de cerrar app
6. ✅ Logout
7. ✅ Navegación entre tabs
8. ✅ Protección de rutas

## 🎯 Próximas características

- [ ] Forgot Password
- [ ] Email verification
- [ ] Social login (Google, Apple)
- [ ] Profile editing
- [ ] Avatar upload
- [ ] Push notifications
- [ ] Offline mode
- [ ] Deep linking
