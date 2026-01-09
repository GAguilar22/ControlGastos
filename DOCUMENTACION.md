# Documentació del Projecte: Control de Despeses

## 1. Descripció del Projecte

Aquesta aplicació web permet als usuaris portar un control senzill de les seves despeses mensuals. Està dissenyada per ser ràpida i fàcil d'utilitzar, oferint una vista clara del total gastat en el mes actual.

**URL de Producció:** [https://controlgastos-production-81e3.up.railway.app/](https://controlgastos-production-81e3.up.railway.app/)

## 2. Base de Dades

El projecte utilitza **lowdb**, una base de dades local basada en un fitxer JSON lleuger.

*   **Tecnologia:** `lowdb` (v7.0.1)
*   **Fitxer de Dades:** `db.json`
*   **Estructura de Dades:**
    El fitxer `db.json` emmagatzema un objecte JSON amb una matriu anomenada `expenses`. Cada objecte dins de la matriu representa una despesa amb la següent estructura:

    ```json
    {
      "expenses": [
        {
          "id": "1734621234567",       // Identificador únic (basat en timestamp)
          "concept": "Supermercat",     // Concepte de la despesa
          "amount": 50.00,              // Import de la despesa (numèric)
          "date": "2025-12-19T10:30:00.000Z" // Data en format ISO
        }
      ]
    }
    ```

## 3. Funcions del Projecte

El projecte es divideix en Backend (Servidor) i Frontend (Client). A continuació es detallen les funcions principals utilitzades en cadascun.

### 3.1 Backend (`server.js`)
El servidor està construït amb **Express.js** i exposa una API RESTful per gestionar les despeses.

*   **`GET /api/expenses`**:
    *   **Descripció:** Llegeix el fitxer `db.json` i retorna la llista completa de despeses.
    *   **Ús:** S'utilitza en carregar la pàgina per obtenir les dades a mostrar.

*   **`POST /api/expenses`**:
    *   **Descripció:** Rep un objecte JSON amb `concept`, `amount` i `date`. Genera un ID únic i guarda la nova despesa a la base de dades.
    *   **Ús:** S'executa quan l'usuari envia el formulari d'afegir despesa.

*   **`DELETE /api/expenses/:id`**:
    *   **Descripció:** Cerca una despesa pel seu `id` i l'elimina de la llista en `db.json`.
    *   **Ús:** S'invoca quan l'usuari fa clic a la icona de la paperera en una despesa.

### 3.2 Frontend (`public/client.js`)
El client utilitza JavaScript (Vanilla) per gestionar la interfície i la comunicació amb l'API.

*   **`cargarGastos()`**:
    *   **Funció:** Fa una petició `fetch` al servidor (`GET /api/expenses`) per obtenir les dades.
    *   **Detall:** Un cop rebudes les dades, crida a `renderizarGastos` per actualitzar la vista.

*   **`renderizarGastos(gastos)`**:
    *   **Funció:** S'encarrega de pintar la llista de despeses i calcular el total.
    *   **Lògica Clau:**
        *   Filtra les despeses per mostrar **només les del mes i any actual**.
        *   Ordena les despeses per data (de més recent a més antiga).
        *   Calcula la suma total de les despeses mostrades.
        *   Actualitza el DOM amb els elements `<li>` corresponents.

*   **Esdeveniment `submit` del formulari**:
    *   **Funció:** Captura l'esdeveniment d'enviament del formulari.
    *   **Procés:** Prevé el comportament per defecte, recull els valors inputs, assigna la data actual i crida a l'API (`POST /api/expenses`) per guardar la despesa. Si té èxit, neteja el formulari i recarrega la llista.

*   **`borrarGasto(id)`**:
    *   **Funció:** Elimina una despesa específica.
    *   **Detall:** Demana confirmació a l'usuari (`confirm()`) i, si s'accepta, envia una petició `DELETE` al servidor. Finalment, recarrega la llista per reflectir els canvis.

## 4. Anàlisi de la Interfície (Producció)

Basat en l'anàlisi de la versió en producció:

*   **Disseny Visual:** Interfície neta i centrada, optimitzada per a dispositius mòbils (responsive). Utilitza una targeta de resum destacada amb un gradient blau/turquesa per al total.
*   **Informació en Pantalla:**
    *   Mostra el mes actual (ex: "Desembre 2025") per donar context temporal.
    *   Llista les despeses amb dia, concepte i import (marcat en color vermellós per indicar sortida de diners).
*   **Interactivitat:** La resposta de la interfície és immediata gràcies a l'actualització del DOM mitjançant JavaScript sense necessitat de recarregar tota la pàgina.
