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

3. Mise en place de la possibilité directe d'ajout d'Item sur chaque combobox
avec les donnees de formulaires qui restent entre les differentes navigations.

4. Modification du "Add Button" pour une meilleure compréhension de l'interface
5. Remise en place du contexte AuthContext pour gérer les sessions user
