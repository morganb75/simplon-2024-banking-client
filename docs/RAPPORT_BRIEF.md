## RESOLUTION DES PROBLEMES UX

1. pb identifié:  Blocage dès le départ si on n'a pas de compte, loader persistent et bloquage de l'appli
   Solution adoptée => fix dans AuthContext.js:
   
```jsx
const login = async (username, password) => {
   try {
    const data = await loginService.login(username, password);
    setAuth(data);
    return data;
   } catch (error) {
    console.error('Login failed:', error);
    throw error;
   }
   };
 ```
devient:
```jsx
const login = async (username, password) => {
   try {
    const data = await loginService.login(username, password);
    setAuth(data);
    return data;
   } catch (error) {
    console.error('Login failed:', error);
    return false;
   }
   };
 ```
2. Mise en place de la CI qui va générer un rapport lighthouse
fichier: .github/workflows/pipeline.yml