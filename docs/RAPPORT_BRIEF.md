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
fichier: .github/workflows/pipeline.yml pb néanmoins, je ne parviens pas à faire générer le rapport pour toutes les url de l'appli

3. Mise en place de la possibilité directe d'ajout d'Item sur chaque combobox
avec les donnees de formulaires qui restent entre les differentes navigations.

4. Divers remaniements css et structure (non finis...): 
- ajout d'un Layout qui met une structure header-main-footer
-  Modification du "Add Button" pour une meilleure compréhension de l'interface

5. Remise en place du contexte AuthContext pour gérer les sessions user, le token se stocke désormais dans le localStorage.
Pour que le user reste en mémoire, rajout possible d'un "rester connecté" (checkbox en login, qui aura pour effet de stocker le token en session storage)
