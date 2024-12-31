***Guía de Configuración y Ejecución del Proyecto: Sistema de Gestión de Contactos***
-------------------------------------------------------------------------------
**Descripción del Proyecto**
Este proyecto es una herramienta para la gestión de contactos en Salesforce, que permite crear, actualizar, eliminar y buscar contactos. La interfaz de usuario se construye utilizando un Lightning Web Component (LWC), mientras que la lógica de negocio se maneja en Apex

**Credenciales para Iniciar Sesion**
- URL: https://global664-dev-ed.develop.lightning.force.com/
- UserName: pruebaglobal66@salesforce.com
- Contraseña: Global66

**Ejecución del Proyecto**
Una vez loggeado a la organizacion, si no te encuentras en la app de Sales puedes navegar a ella clickeando en el App Launcher. Una vez alli, navega a la segunda tab con el nombre de "Contact Management" donde se encuentra el LWC creado y a su derecha una List View Standard de contactos
Desde la interfaz, puedes: 
- Crear contactos con los campos FirstName, LastName, Email (Requerido) y Phone
- Ver los contactos existentes
- Actualizar los datos de los contactos
- Eliminar contactos seleccionados

**Pruebas**
El proyecto incluye pruebas unitarias en Apex para validar las operaciones de creación, actualización, eliminación y recuperación de contactos.

**Elecciones de Diseño**
- Uso de Apex y LWC: Opté por separar la lógica de negocio en Apex para asegurarme de que las operaciones de base de datos estuvieran bien gestionadas y controladas, pasando los parametros necesarios para que el componente LWC tenga buena respuesta.
- Manejo de Excepciones: He utilizado AuraHandledException para poder tener mensajes de error claros al momento de debuggear y mensajes Toast para manejar errores específicos y garantizar que el usuario reciba mensajes claros y comprensibles.
- Interactividad: Se implementaron funcionalidades como la selección de filas en una tabla para facilitar la eliminación de contactos. También se añadió un filtro de búsqueda para mejorar la experiencia del usuario al gestionar contactos

**Clonacion de Proyecto**
- URL Repo: https://github.com/CataHermoso/Global66
- URL GitHub: https://github.com/CataHermoso

**Disclaimer**
Las líneas comentadas la clase Test del Controller corresponden al manejo de excepciones dentro de los metodos del mismo. Debido a la configuración específica del entorno de prueba, no pude hacer que se pasara correctamente este paso, por lo que opté por comentarlas para poder continuar con la validación de otros aspectos. Sin embargo, las deje expuestas como comentarios para que se pueda ver que intenté cubrir lo más posible del códigoy que con más tiempo se podrían ajustar detalles adicionales