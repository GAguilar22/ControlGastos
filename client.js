
// Modificacio per a Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjmZ5MErGHRiUFZGSTnWt5Fe2SDARTO0o",
    authDomain: "aa1controlgastos.firebaseapp.com",
    projectId: "aa1controlgastos",
    storageBucket: "aa1controlgastos.firebasestorage.app",
    messagingSenderId: "201395356227",
    appId: "1:201395356227:web:a45c5fbab0c9d7699b0af6",
    measurementId: "G-ZH0HW6PEF7"
};

//  Modificacio per a Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const expensesRef = db.collection("expenses");

document.addEventListener('DOMContentLoaded', () => {
    // Modificacio per a Firebase
    // Esto modifica el 'cargarGastos' y s'executa automaticament en afegir/esborrar en temps real
    expensesRef.onSnapshot((snapshot) => {
        const gastos = [];
        snapshot.forEach((doc) => {
            gastos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderizarGastos(gastos);
    });

    const formulario = document.getElementById('formulario-gasto');
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputConcepto = document.getElementById('concepto');
        const inputCantidad = document.getElementById('cantidad');

        // Data actual
        const ahora = new Date();
        const nuevaDespesa = {
            concept: inputConcepto.value,
            amount: parseFloat(inputCantidad.value),
            date: ahora.toISOString()
        };

        try {
            // Modificacio per a Firebase crea nova despesa
            await expensesRef.add(nuevaDespesa);


            inputConcepto.value = '';
            inputCantidad.value = '';
        } catch (error) {
            console.error('Error al guardar la despesa:', error);
            alert('Hi ha hagut un error al guardar la despesa.');
        }
    });
});

function renderizarGastos(gastos) {
    const contenedorLista = document.getElementById('lista-gastos');
    const elementoTotal = document.getElementById('cantidad-total');
    const elementoMesActual = document.getElementById('mes-actual');

    contenedorLista.innerHTML = '';

    // Filtrar per al mes actual
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anyActual = ahora.getFullYear();

    // Noms dels mesos en Català
    const nomsMesos = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];
    elementoMesActual.textContent = `${nomsMesos[mesActual]} ${anyActual}`;

    let total = 0;

    // Ordenar per data
    const gastosOrdenados = gastos.sort((a, b) => new Date(b.date) - new Date(a.date));

    gastosOrdenados.forEach(gasto => {
        const fechaGasto = new Date(gasto.date);


        if (fechaGasto.getMonth() === mesActual && fechaGasto.getFullYear() === anyActual) {

            total += gasto.amount;

            const li = document.createElement('li');
            li.className = 'elemento-gasto';

            // Mostrem el dia actual
            const dia = fechaGasto.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });

            li.innerHTML = `
                <div class="info-gasto">
                    <span class="fecha-gasto">${dia}</span>
                    <span class="concepto-gasto">${gasto.concept}</span>
                </div>
                <div class="acciones-gasto">
                    <span class="monto-gasto">${gasto.amount.toFixed(2)} €</span>
                    <button class="boton-eliminar" onclick="borrarGasto('${gasto.id}')">🗑️</button>
                </div>
            `;
            contenedorLista.appendChild(li);
        }
    });

    elementoTotal.textContent = `${total.toFixed(2)} €`;
}

// Modificacio per a Firebase per esborrar despeses
window.borrarGasto = async function (id) {
    if (!confirm('Estàs segur d\'esborrar aquesta despesa?')) return;

    try {
        await expensesRef.doc(id).delete();
    } catch (error) {
        console.error('Error eliminant:', error);
        alert('Error a l\'esborrar la despesa');
    }
};
