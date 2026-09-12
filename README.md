# LÚMINA — Landing + solicitud por WhatsApp

Esta versión es la primera etapa del sistema.

## Flujo actual

```text
CLIENTA
   ↓
Landing
   ↓
Elige tratamiento
   ↓
Elige fecha
   ↓
Elige horario
   ↓
Llena sus datos
   ↓
Comentarios importantes
   ↓
"Enviar datos por WhatsApp"
   ↓
WhatsApp
   ↓
Mensaje prellenado con todos los datos
```

El mensaje incluye:

- Tratamiento
- Duración
- Fecha
- Hora
- Nombre
- WhatsApp
- Correo
- Comentarios importantes

Los comentarios permiten que la clienta informe, por ejemplo, sobre alergias, sensibilidad de la piel, embarazo, padecimientos u otra condición que considere importante que la especialista conozca antes del tratamiento.

## Configurar WhatsApp

Abre `app.js` y cambia:

```js
const WHATSAPP_NUMBER = "52XXXXXXXXXX";
```

Por el número real de la cabina, con código de país y sin `+`, espacios o guiones.

Ejemplo:

```js
const WHATSAPP_NUMBER = "524431234567";
```

## Importante

En esta etapa los horarios que aparecen son DEMO.

Todavía NO se consulta Google Calendar y NO se crea una cita automáticamente.

La siguiente etapa puede conectar:

```text
Landing
   ↓
n8n
   ↓
Google Calendar
```

para que la disponibilidad sea real y para evitar dobles reservas.

## Privacidad

Los comentarios pueden contener información personal sensible. Por eso, en producción conviene:

- informar claramente para qué se recopilan;
- pedir únicamente la información necesaria;
- evitar almacenar esos datos en sistemas innecesarios;
- limitar quién puede acceder a ellos;
- definir cuánto tiempo se conservarán.

La especialista debe usar esa información para valorar el tratamiento y, cuando corresponda, solicitar aclaraciones o recomendar valoración profesional. La landing no debe diagnosticar ni decidir automáticamente qué tratamiento médico corresponde.
