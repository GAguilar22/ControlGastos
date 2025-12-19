document.addEventListener('DOMContentLoaded', () => {
    cargarGastos();

    const formulario = document.getElementById('formulario-gasto');
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputConcepto = document.getElementById('concepto');
        const inputCantidad = document.getElementById('cantidad');

        // Uso la fecha de hoy por defecto para el registro interno
        const ahora = new Date();
        const datosGasto = {
            concept: inputConcepto.value,
            amount: inputCantidad.value,
            date: ahora.toISOString() // Guardamos la fecha completa ISO
        };

        try {
            const respuesta = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosGasto)
            });

            if (respuesta.ok) {
                // Limpiar formulario y recargar lista
                inputConcepto.value = '';
                inputCantidad.value = '';
                cargarGastos();
            } else {
                console.error('Error al guardar la despesa');
                alert('Hi ha hagut un error al guardar la despesa.');
            }
        } catch (error) {
            console.error('Error de xarxa:', error);
        }
    });
});

async function cargarGastos() {
    try {
        const respuesta = await fetch('/api/expenses');
        const gastos = await respuesta.json();

        renderizarGastos(gastos);
    } catch (error) {
        console.error('Error carregant despeses:', error);
    }
}

function renderizarGastos(gastos) {
    const contenedorLista = document.getElementById('lista-gastos');
    const elementoTotal = document.getElementById('cantidad-total');
    const elementoMesActual = document.getElementById('mes-actual');

    contenedorLista.innerHTML = '';

    // Filtramos para mostrar solo los gastos del mes actual
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anyActual = ahora.getFullYear();

    // Nombres de los meses en Catalán
    const nomsMesos = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];
    elementoMesActual.textContent = `${nomsMesos[mesActual]} ${anyActual}`;

    let total = 0;

    // Ordenamos por fecha descendente (más nuevo arriba)
    const gastosOrdenados = gastos.sort((a, b) => new Date(b.date) - new Date(a.date));

    gastosOrdenados.forEach(gasto => {
        const fechaGasto = new Date(gasto.date);

        // Solo mostrar si es del mes y año actual
        if (fechaGasto.getMonth() === mesActual && fechaGasto.getFullYear() === anyActual) {

            total += gasto.amount;

            const li = document.createElement('li');
            li.className = 'elemento-gasto';

            // Formatear fecha para mostrar día
            // 'ca-ES' para formato catalán, aunque visualmente será similar "25 dic."
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

async function borrarGasto(id) {
    if (!confirm('Estàs segur d\'esborrar aquesta despesa?')) return;

    try {
        const respuesta = await fetch(`/api/expenses/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            cargarGastos();
        } else {
            alert('Error a l\'esborrar la despesa');
        }
    } catch (error) {
        console.error('Error eliminant:', error);
    }
}

// Hacer la función borrarGasto accesible globalmente para el onclick del HTML
window.borrarGasto = borrarGasto;
