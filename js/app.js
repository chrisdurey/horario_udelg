/* Main application logic */

// Navigation
const sections = document.querySelectorAll('main section');
const navButtons = document.querySelectorAll('header nav button');

function setActiveSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navButtons.forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelector(`#nav-${id.split('-')[1]}`).classList.add('active');
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        setActiveSection(`section-${button.id.split('-')[1]}`);
        if (button.id === 'nav-carreras') loadCarreras();
        if (button.id === 'nav-materias') loadMaterias();
        if (button.id === 'nav-maestros') loadMaestros();
        if (button.id === 'nav-horarios') loadHorarios();
    });
});

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Helper to safely get arrays from Storage
function safeGetArray(key) {
    const val = Storage.get(key);
    return Array.isArray(val) ? val : [];
}

// ------ CARRERAS ------
const carreraInput = document.getElementById('input-carrera');
const btnAgregarCarrera = document.getElementById('btn-agregar-carrera');
const listaCarreras = document.getElementById('lista-carreras');
const searchCarrera = document.getElementById('search-carrera');

function loadCarreras() {
    if (!listaCarreras) return;
    listaCarreras.innerHTML = '';
    const carreras = safeGetArray('carreras');
    carreras.forEach(carrera => {
        const li = document.createElement('li');
        li.textContent = carrera.nombre;
        const actions = document.createElement('div');
        actions.classList.add('actions');
        const modBtn = document.createElement('button');
        modBtn.textContent = 'Modificar';
        modBtn.onclick = () => modificarCarrera(carrera.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.onclick = () => eliminarCarrera(carrera.id);
        actions.appendChild(modBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);
        listaCarreras.appendChild(li);
    });
}

if (btnAgregarCarrera) {
    btnAgregarCarrera.addEventListener('click', () => {
        const nombre = carreraInput.value.trim();
        if (nombre === '') {
            alert('Ingrese un nombre válido para la carrera');
            return;
        }
        const nuevaCarrera = { id: generateId(), nombre: nombre };
        Storage.add('carreras', nuevaCarrera);
        carreraInput.value = '';
        loadCarreras();
        cargarCarrerasSelect();
    });
}

function modificarCarrera(id) {
    const carreras = safeGetArray('carreras');
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) return;
    const nuevoNombre = prompt('Modificar nombre de la carrera:', carrera.nombre);
    if (nuevoNombre && nuevoNombre.trim() !== '') {
        carrera.nombre = nuevoNombre.trim();
        Storage.update('carreras', id, carrera);
        loadCarreras();
        cargarCarrerasSelect();
    }
}

function eliminarCarrera(id) {
    if (confirm('¿Está seguro de eliminar esta carrera?')) {
        Storage.delete('carreras', id);
        loadCarreras();
        cargarCarrerasSelect();
    }
}

if (searchCarrera) {
    searchCarrera.addEventListener('input', () => {
        const filter = searchCarrera.value.toLowerCase();
        listaCarreras.innerHTML = '';
        const carreras = safeGetArray('carreras').filter(c => c.nombre.toLowerCase().includes(filter));
        carreras.forEach(carrera => {
            const li = document.createElement('li');
            li.textContent = carrera.nombre;
            const actions = document.createElement('div');
            actions.classList.add('actions');
            const modBtn = document.createElement('button');
            modBtn.textContent = 'Modificar';
            modBtn.onclick = () => modificarCarrera(carrera.id);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => eliminarCarrera(carrera.id);
            actions.appendChild(modBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            listaCarreras.appendChild(li);
        });
    });
}

// Load Carreras into select for Horarios
function cargarCarrerasSelect() {
    const select = document.getElementById('select-carrera-horario');
    if (!select) return;
    select.innerHTML = '<option value="">-- Seleccione Carrera --</option>';
    const carreras = safeGetArray('carreras');
    carreras.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.nombre;
        select.appendChild(option);
    });
}

// ------ MATERIAS ------
const materiaInput = document.getElementById('input-materia');
const especialidadMateriaInput = document.getElementById('input-especialidad-materia');
const btnAgregarMateria = document.getElementById('btn-agregar-materia');
const listaMaterias = document.getElementById('lista-materias');
const searchMateria = document.getElementById('search-materia');

function loadMaterias() {
    if (!listaMaterias) return;
    listaMaterias.innerHTML = '';
    const materias = safeGetArray('materias');
    materias.forEach(materia => {
        const li = document.createElement('li');
        li.textContent = `${materia.nombre} - Especialidad: ${materia.especialidad}`;
        const actions = document.createElement('div');
        actions.classList.add('actions');
        const modBtn = document.createElement('button');
        modBtn.textContent = 'Modificar';
        modBtn.onclick = () => modificarMateria(materia.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.onclick = () => eliminarMateria(materia.id);
        actions.appendChild(modBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);
        listaMaterias.appendChild(li);
    });
}

if (btnAgregarMateria) {
    btnAgregarMateria.addEventListener('click', () => {
        const nombre = materiaInput.value.trim();
        const especialidad = especialidadMateriaInput.value.trim();
        if (!nombre || !especialidad) {
            alert('Por favor, ingrese nombre y especialidad de la materia.');
            return;
        }
        const nuevaMateria = { id: generateId(), nombre, especialidad };
        Storage.add('materias', nuevaMateria);
        materiaInput.value = '';
        especialidadMateriaInput.value = '';
        loadMaterias();
    });
}

function modificarMateria(id) {
    const materias = safeGetArray('materias');
    const materia = materias.find(m => m.id === id);
    if (!materia) return;
    const nuevoNombre = prompt('Modificar nombre de la materia:', materia.nombre);
    if (!nuevoNombre) return;
    const nuevaEspecialidad = prompt('Modificar especialidad:', materia.especialidad);
    if (!nuevaEspecialidad) return;
    materia.nombre = nuevoNombre.trim();
    materia.especialidad = nuevaEspecialidad.trim();
    Storage.update('materias', id, materia);
    loadMaterias();
}

function eliminarMateria(id) {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
        Storage.delete('materias', id);
        loadMaterias();
    }
}

if (searchMateria) {
    searchMateria.addEventListener('input', () => {
        const filter = searchMateria.value.toLowerCase();
        listaMaterias.innerHTML = '';
        const materias = safeGetArray('materias').filter(m => m.nombre.toLowerCase().includes(filter));
        materias.forEach(materia => {
            const li = document.createElement('li');
            li.textContent = `${materia.nombre} - Especialidad: ${materia.especialidad}`;
            const actions = document.createElement('div');
            actions.classList.add('actions');
            const modBtn = document.createElement('button');
            modBtn.textContent = 'Modificar';
            modBtn.onclick = () => modificarMateria(materia.id);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => eliminarMateria(materia.id);
            actions.appendChild(modBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            listaMaterias.appendChild(li);
        });
    });
}

// ------ MAESTROS ------
const nombreMaestroInput = document.getElementById('input-nombre-maestro');
const especialidadMaestroInput = document.getElementById('input-especialidad-maestro');
const btnAgregarMaestro = document.getElementById('btn-agregar-maestro');
const listaMaestros = document.getElementById('lista-maestros');
const searchMaestro = document.getElementById('search-maestro');

function loadMaestros() {
    if (!listaMaestros) return;
    listaMaestros.innerHTML = '';
    const maestros = safeGetArray('maestros');
    maestros.forEach(maestro => {
        const li = document.createElement('li');
        li.textContent = `${maestro.nombre} - Especialidad: ${maestro.especialidad}`;
        const actions = document.createElement('div');
        actions.classList.add('actions');
        const modBtn = document.createElement('button');
        modBtn.textContent = 'Modificar';
        modBtn.onclick = () => modificarMaestro(maestro.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Eliminar';
        delBtn.onclick = () => eliminarMaestro(maestro.id);
        actions.appendChild(modBtn);
        actions.appendChild(delBtn);
        li.appendChild(actions);
        listaMaestros.appendChild(li);
    });
}

if (btnAgregarMaestro) {
    btnAgregarMaestro.addEventListener('click', () => {
        const nombre = nombreMaestroInput.value.trim();
        const especialidad = especialidadMaestroInput.value.trim();
        if (!nombre || !especialidad) {
            alert('Por favor, ingrese nombre y especialidad del maestro.');
            return;
        }
        const nuevoMaestro = { id: generateId(), nombre, especialidad };
        Storage.add('maestros', nuevoMaestro);
        nombreMaestroInput.value = '';
        especialidadMaestroInput.value = '';
        loadMaestros();
    });
}

function modificarMaestro(id) {
    const maestros = safeGetArray('maestros');
    const maestro = maestros.find(m => m.id === id);
    if (!maestro) return;
    const nuevoNombre = prompt('Modificar nombre del maestro:', maestro.nombre);
    if (!nuevoNombre) return;
    const nuevaEspecialidad = prompt('Modificar especialidad:', maestro.especialidad);
    if (!nuevaEspecialidad) return;
    maestro.nombre = nuevoNombre.trim();
    maestro.especialidad = nuevaEspecialidad.trim();
    Storage.update('maestros', id, maestro);
    loadMaestros();
}

function eliminarMaestro(id) {
    if (confirm('¿Está seguro de eliminar este maestro?')) {
        Storage.delete('maestros', id);
        loadMaestros();
    }
}

if (searchMaestro) {
    searchMaestro.addEventListener('input', () => {
        const filter = searchMaestro.value.toLowerCase();
        listaMaestros.innerHTML = '';
        const maestros = safeGetArray('maestros').filter(m => m.nombre.toLowerCase().includes(filter));
        maestros.forEach(maestro => {
            const li = document.createElement('li');
            li.textContent = `${maestro.nombre} - Especialidad: ${maestro.especialidad}`;
            const actions = document.createElement('div');
            actions.classList.add('actions');
            const modBtn = document.createElement('button');
            modBtn.textContent = 'Modificar';
            modBtn.onclick = () => modificarMaestro(maestro.id);
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Eliminar';
            delBtn.onclick = () => eliminarMaestro(maestro.id);
            actions.appendChild(modBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            listaMaestros.appendChild(li);
        });
    });
}

// ------ SECCIÓN HORARIOS - REEMPLAZO COMPLETO ------
const tablaHorarioSemanalBody = document.querySelector('#tabla-horario-semanal tbody');
const tablaHorarioSabatinoBody = document.querySelector('#tabla-horario-sabatino tbody');
const btnGuardarHorario = document.getElementById('btn-guardar-horario');
const btnActualizarHorario = document.getElementById('btn-actualizar-horario');
const selectCarreraHorario = document.getElementById('select-carrera-horario');

// Variables globales simplificadas
let horarioTemporal = {
    semanal: {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: []
    },
    sabatino: []
};

// Función para limpiar horario temporal
function limpiarHorarioTemporal() {
    horarioTemporal = {
        semanal: {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: []
        },
        sabatino: []
    };
}

// Función para generar tabla semanal
function generarTablaHorarioSemanal() {
    if (!tablaHorarioSemanalBody) return;
    
    tablaHorarioSemanalBody.innerHTML = '';
    const horarios = [
        '07:00', '07:50', '08:40', '09:30',  // Mañana
        '10:00', '10:50', '11:40', '12:30', '13:20'  // Tarde
    ];
    
    horarios.forEach((hora, index) => {
        const tr = document.createElement('tr');
        
        // Columna de hora
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        tr.appendChild(tdHora);
        
        // Columnas para cada día
        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].forEach(dia => {
            const td = document.createElement('td');
            td.dataset.dia = dia;
            td.dataset.index = index;
            td.classList.add('celda-horario');
            td.style.cssText = 'border: 1px solid #ddd; padding: 8px; cursor: pointer; min-height: 50px;';
            td.addEventListener('click', function() {
                abrirModalAsignacion(this);
            });
            tr.appendChild(td);
        });
        
        tablaHorarioSemanalBody.appendChild(tr);
    });
}

// Función para generar tabla sabatina
function generarTablaHorarioSabatino() {
    if (!tablaHorarioSabatinoBody) return;
    
    tablaHorarioSabatinoBody.innerHTML = '';
    const horarios = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
    
    horarios.forEach((hora, index) => {
        const tr = document.createElement('tr');
        
        // Columna de hora
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        tr.appendChild(tdHora);
        
        // Columna para sábado
        const td = document.createElement('td');
        td.dataset.dia = 'sabado';
        td.dataset.index = index;
        td.classList.add('celda-horario');
        td.style.cssText = 'border: 1px solid #ddd; padding: 8px; cursor: pointer; min-height: 50px;';
        td.addEventListener('click', function() {
            abrirModalAsignacion(this);
        });
        tr.appendChild(td);
        
        tablaHorarioSabatinoBody.appendChild(tr);
    });
}

// Función para abrir modal de asignación
function abrirModalAsignacion(celda) {
    console.log('Abriendo modal para celda:', celda.dataset.dia, celda.dataset.index);
    
    const materias = safeGetArray('materias');
    const maestros = safeGetArray('maestros');
    
    console.log('Materias disponibles:', materias);
    console.log('Maestros disponibles:', maestros);
    
    if (materias.length === 0) {
        alert('No hay materias disponibles. Por favor, agregue materias primero.');
        return;
    }
    
    if (maestros.length === 0) {
        alert('No hay maestros disponibles. Por favor, agregue maestros primero.');
        return;
    }
    
    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'modal-asignacion';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%;">
            <h3>Asignar Materia y Maestro</h3>
            <p>Día: <strong>${celda.dataset.dia}</strong> - Hora: <strong>${celda.parentElement.firstChild.textContent}</strong></p>
            
            <div style="margin-bottom: 15px;">
                <label>Materia:</label>
                <select id="select-materia" style="width: 100%; padding: 5px; margin-top: 5px;">
                    <option value="">-- Seleccionar Materia --</option>
                    ${materias.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label>Maestro:</label>
                <select id="select-maestro" style="width: 100%; padding: 5px; margin-top: 5px;">
                    <option value="">-- Seleccionar Maestro --</option>
                    ${maestros.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                </select>
            </div>
            
            <div style="text-align: right;">
                <button onclick="limpiarAsignacion()" style="background: #f44336; color: white; padding: 8px 15px; border: none; border-radius: 4px; margin-right: 10px;">Limpiar</button>
                <button onclick="guardarAsignacion()" style="background: #4CAF50; color: white; padding: 8px 15px; border: none; border-radius: 4px; margin-right: 10px;">Guardar</button>
                <button onclick="cerrarModal()" style="background: #ccc; padding: 8px 15px; border: none; border-radius: 4px;">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Preseleccionar valores si ya están asignados
    if (celda.dataset.materiaId) {
        document.getElementById('select-materia').value = celda.dataset.materiaId;
    }
    if (celda.dataset.maestroId) {
        document.getElementById('select-maestro').value = celda.dataset.maestroId;
    }
    
    // Almacenar referencia a la celda actual
    window.celdaActual = celda;
}

// Función para cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modal-asignacion');
    if (modal) {
        document.body.removeChild(modal);
    }
    window.celdaActual = null;
}

// Función para limpiar asignación
function limpiarAsignacion() {
    if (window.celdaActual) {
        window.celdaActual.innerHTML = '';
        window.celdaActual.dataset.materiaId = '';
        window.celdaActual.dataset.maestroId = '';
        actualizarHorarioTemporal();
        console.log('Asignación limpiada');
    }
    cerrarModal();
}

// Función para guardar asignación
function guardarAsignacion() {
    if (!window.celdaActual) {
        alert('Error: No se encontró la celda seleccionada');
        return;
    }
    
    const materiaId = document.getElementById('select-materia').value;
    const maestroId = document.getElementById('select-maestro').value;
    
    if (!materiaId || !maestroId) {
        alert('Por favor, seleccione materia y maestro');
        return;
    }
    
    // Obtener nombres para mostrar
    const materias = safeGetArray('materias');
    const maestros = safeGetArray('maestros');
    const materia = materias.find(m => m.id === materiaId);
    const maestro = maestros.find(m => m.id === maestroId);
    
    if (!materia || !maestro) {
        alert('Error: Materia o maestro no encontrado');
        return;
    }
    
    // Actualizar celda
    window.celdaActual.dataset.materiaId = materiaId;
    window.celdaActual.dataset.maestroId = maestroId;
    window.celdaActual.innerHTML = `<strong>${materia.nombre}</strong><br><small>${maestro.nombre}</small>`;
    
    // Actualizar horario temporal
    actualizarHorarioTemporal();
    
    console.log('Asignación guardada:', {
        dia: window.celdaActual.dataset.dia,
        index: window.celdaActual.dataset.index,
        materia: materia.nombre,
        maestro: maestro.nombre
    });
    
    cerrarModal();
}

// Función para actualizar horario temporal
function actualizarHorarioTemporal() {
    // Actualizar semanal
    const celdasSemanales = document.querySelectorAll('#tabla-horario-semanal .celda-horario');
    celdasSemanales.forEach(celda => {
        const dia = celda.dataset.dia;
        const index = parseInt(celda.dataset.index);
        
        // Asegurar que el array existe
        if (!horarioTemporal.semanal[dia]) {
            horarioTemporal.semanal[dia] = [];
        }
        
        // Llenar el array hasta el índice necesario
        while (horarioTemporal.semanal[dia].length <= index) {
            horarioTemporal.semanal[dia].push({});
        }
        
        // Actualizar la posición
        horarioTemporal.semanal[dia][index] = {
            materiaId: celda.dataset.materiaId || null,
            maestroId: celda.dataset.maestroId || null
        };
    });
    
    // Actualizar sabatino
    const celdasSabatinas = document.querySelectorAll('#tabla-horario-sabatino .celda-horario');
    horarioTemporal.sabatino = [];
    celdasSabatinas.forEach(celda => {
        const index = parseInt(celda.dataset.index);
        
        // Llenar el array hasta el índice necesario
        while (horarioTemporal.sabatino.length <= index) {
            horarioTemporal.sabatino.push({});
        }
        
        horarioTemporal.sabatino[index] = {
            materiaId: celda.dataset.materiaId || null,
            maestroId: celda.dataset.maestroId || null
        };
    });
    
    console.log('Horario temporal actualizado:', horarioTemporal);
}

// Función para cargar horario en las tablas
function cargarHorarioEnTablas(horario) {
    if (!horario) return;
    
    console.log('Cargando horario en tablas:', horario);
    
    // Cargar semanal
    const celdasSemanales = document.querySelectorAll('#tabla-horario-semanal .celda-horario');
    celdasSemanales.forEach(celda => {
        const dia = celda.dataset.dia;
        const index = parseInt(celda.dataset.index);
        
        if (horario.semanal && horario.semanal[dia] && horario.semanal[dia][index]) {
            const asignacion = horario.semanal[dia][index];
            
            if (asignacion.materiaId && asignacion.maestroId) {
                const materias = safeGetArray('materias');
                const maestros = safeGetArray('maestros');
                const materia = materias.find(m => m.id === asignacion.materiaId);
                const maestro = maestros.find(m => m.id === asignacion.maestroId);
                
                if (materia && maestro) {
                    celda.dataset.materiaId = asignacion.materiaId;
                    celda.dataset.maestroId = asignacion.maestroId;
                    celda.innerHTML = `<strong>${materia.nombre}</strong><br><small>${maestro.nombre}</small>`;
                }
            }
        }
    });
    
    // Cargar sabatino
    const celdasSabatinas = document.querySelectorAll('#tabla-horario-sabatino .celda-horario');
    celdasSabatinas.forEach(celda => {
        const index = parseInt(celda.dataset.index);
        
        if (horario.sabatino && horario.sabatino[index]) {
            const asignacion = horario.sabatino[index];
            
            if (asignacion.materiaId && asignacion.maestroId) {
                const materias = safeGetArray('materias');
                const maestros = safeGetArray('maestros');
                const materia = materias.find(m => m.id === asignacion.materiaId);
                const maestro = maestros.find(m => m.id === asignacion.maestroId);
                
                if (materia && maestro) {
                    celda.dataset.materiaId = asignacion.materiaId;
                    celda.dataset.maestroId = asignacion.maestroId;
                    celda.innerHTML = `<strong>${materia.nombre}</strong><br><small>${maestro.nombre}</small>`;
                }
            }
        }
    });
    
    // Sincronizar con horario temporal
    horarioTemporal = JSON.parse(JSON.stringify(horario));
}

// Event listener para guardar horario
if (btnGuardarHorario) {
    btnGuardarHorario.addEventListener('click', () => {
        const carreraId = selectCarreraHorario.value;
        
        if (!carreraId) {
            alert('Seleccione una carrera para guardar el horario.');
            return;
        }
        
        actualizarHorarioTemporal();
        
        const horarios = safeGetArray('horarios');
        const horarioExistente = horarios.find(h => h.carreraId === carreraId);
        
        if (horarioExistente) {
            // Actualizar existente
            horarioExistente.semanal = horarioTemporal.semanal;
            horarioExistente.sabatino = horarioTemporal.sabatino;
        } else {
            // Crear nuevo
            horarios.push({
                id: generateId(),
                carreraId: carreraId,
                semanal: horarioTemporal.semanal,
                sabatino: horarioTemporal.sabatino
            });
        }
        
        Storage.set('horarios', horarios);
        console.log('Horario guardado:', horarios);
        alert('Horario guardado correctamente');
    });
}

// Event listener para actualizar horario
if (btnActualizarHorario) {
    btnActualizarHorario.addEventListener('click', () => {
        if (btnGuardarHorario) {
            btnGuardarHorario.click(); // Reutilizar la lógica de guardar
        }
    });
}

// Event listener para cambio de carrera
if (selectCarreraHorario) {
    selectCarreraHorario.addEventListener('change', () => {
        const carreraId = selectCarreraHorario.value;
        
        if (!carreraId) {
            limpiarHorarioTemporal();
            generarTablaHorarioSemanal();
            generarTablaHorarioSabatino();
            return;
        }
        
        const horarios = safeGetArray('horarios');
        const horarioGuardado = horarios.find(h => h.carreraId === carreraId);
        
        // Regenerar tablas
        generarTablaHorarioSemanal();
        generarTablaHorarioSabatino();
        
        if (horarioGuardado) {
            console.log('Cargando horario guardado para carrera:', carreraId);
            cargarHorarioEnTablas(horarioGuardado);
        } else {
            console.log('No hay horario guardado para carrera:', carreraId);
            limpiarHorarioTemporal();
        }
    });
}

// Función para inicializar horarios
function inicializarHorarios() {
    console.log('Inicializando módulo de horarios...');
    generarTablaHorarioSemanal();
    generarTablaHorarioSabatino();
    limpiarHorarioTemporal();
}

// Llamar inicialización
inicializarHorarios();
