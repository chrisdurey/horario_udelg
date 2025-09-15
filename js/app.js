/* Main application logic - versión entregada con mejoras solicitadas */

// Navigation
const sections = document.querySelectorAll('main section');
const navButtons = document.querySelectorAll('header nav button');

function setActiveSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    navButtons.forEach(b => b.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    const navId = `nav-${id.split('-')[1]}`;
    const navBtn = document.getElementById(navId);
    if (navBtn) navBtn.classList.add('active');
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        setActiveSection(`section-${button.id.split('-')[1]}`);
        if (button.id === 'nav-carreras') loadCarreras();
        if (button.id === 'nav-materias') loadMaterias();
        if (button.id === 'nav-maestros') loadMaestros();
        if (button.id === 'nav-horarios') cargarCarrerasSelect();
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

// ------------------------- CARRERAS (con Grado y Grupo) -------------------------
const carreraInput = document.getElementById('input-carrera');
const gradoCarreraInput = document.getElementById('input-grado-carrera');
const grupoCarreraInput = document.getElementById('input-grupo-carrera');
const btnAgregarCarrera = document.getElementById('btn-agregar-carrera');
const listaCarreras = document.getElementById('lista-carreras');
const searchCarrera = document.getElementById('search-carrera');

function loadCarreras() {
    if (!listaCarreras) return;
    listaCarreras.innerHTML = '';
    const carreras = safeGetArray('carreras');
    carreras.forEach(carrera => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${carrera.nombre}</strong> <span class="small-muted">Grado: ${carrera.grado || '-'} / Grupo: ${carrera.grupo || '-'}</span></div>`;
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
        const grado = gradoCarreraInput.value.trim();
        const grupo = grupoCarreraInput.value.trim();
        if (nombre === '') {
            alert('Ingrese un nombre válido para la carrera');
            return;
        }
        const nuevaCarrera = { id: generateId(), nombre: nombre, grado: grado || '', grupo: grupo || '' };
        Storage.add('carreras', nuevaCarrera);
        carreraInput.value = '';
        gradoCarreraInput.value = '';
        grupoCarreraInput.value = '';
        loadCarreras();
        cargarCarrerasSelect();
        cargarHorariosGuardadosSelect();
    });
}

function modificarCarrera(id) {
    const carreras = safeGetArray('carreras');
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) return;
    const nuevoNombre = prompt('Modificar nombre de la carrera:', carrera.nombre);
    if (!nuevoNombre) return;
    const nuevoGrado = prompt('Modificar grado:', carrera.grado || '');
    if (nuevoGrado === null) return;
    const nuevoGrupo = prompt('Modificar grupo:', carrera.grupo || '');
    if (nuevoGrupo === null) return;
    carrera.nombre = nuevoNombre.trim();
    carrera.grado = nuevoGrado.trim();
    carrera.grupo = nuevoGrupo.trim();
    Storage.update('carreras', id, carrera);
    loadCarreras();
    cargarCarrerasSelect();
    cargarHorariosGuardadosSelect();
}

function eliminarCarrera(id) {
    if (confirm('¿Está seguro de eliminar esta carrera?')) {
        Storage.delete('carreras', id);
        loadCarreras();
        cargarCarrerasSelect();
        cargarHorariosGuardadosSelect();
    }
}

if (searchCarrera) {
    searchCarrera.addEventListener('input', () => {
        const filter = searchCarrera.value.toLowerCase();
        listaCarreras.innerHTML = '';
        const carreras = safeGetArray('carreras').filter(c => c.nombre.toLowerCase().includes(filter));
        carreras.forEach(carrera => {
            const li = document.createElement('li');
            li.innerHTML = `<div><strong>${carrera.nombre}</strong> <span class="small-muted">Grado: ${carrera.grado || '-'} / Grupo: ${carrera.grupo || '-'}</span></div>`;
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
        option.textContent = `${c.nombre} (G:${c.grado || '-'} - ${c.grupo || '-'})`;
        select.appendChild(option);
    });
}

// ------------------------- MATERIAS (con Aula) -------------------------
const materiaInput = document.getElementById('input-materia');
const especialidadMateriaInput = document.getElementById('input-especialidad-materia');
const aulaMateriaInput = document.getElementById('input-aula-materia');
const btnAgregarMateria = document.getElementById('btn-agregar-materia');
const listaMaterias = document.getElementById('lista-materias');
const searchMateria = document.getElementById('search-materia');

function loadMaterias() {
    if (!listaMaterias) return;
    listaMaterias.innerHTML = '';
    const materias = safeGetArray('materias');
    materias.forEach(materia => {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong>${materia.nombre}</strong> <span class="small-muted">Especialidad: ${materia.especialidad || '-'} / Aula: ${materia.aula || '-'}</span></div>`;
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
        const aula = aulaMateriaInput.value.trim();
        if (!nombre || !especialidad) {
            alert('Por favor, ingrese nombre y especialidad de la materia.');
            return;
        }
        const nuevaMateria = { id: generateId(), nombre, especialidad, aula: aula || '' };
        Storage.add('materias', nuevaMateria);
        materiaInput.value = '';
        especialidadMateriaInput.value = '';
        aulaMateriaInput.value = '';
        loadMaterias();
    });
}

function modificarMateria(id) {
    const materias = safeGetArray('materias');
    const materia = materias.find(m => m.id === id);
    if (!materia) return;
    const nuevoNombre = prompt('Modificar nombre de la materia:', materia.nombre);
    if (nuevoNombre === null) return;
    const nuevaEspecialidad = prompt('Modificar especialidad:', materia.especialidad || '');
    if (nuevaEspecialidad === null) return;
    const nuevaAula = prompt('Modificar aula:', materia.aula || '');
    if (nuevaAula === null) return;
    materia.nombre = nuevoNombre.trim();
    materia.especialidad = nuevaEspecialidad.trim();
    materia.aula = nuevaAula.trim();
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
            li.innerHTML = `<div><strong>${materia.nombre}</strong> <span class="small-muted">Especialidad: ${materia.especialidad || '-'} / Aula: ${materia.aula || '-'}</span></div>`;
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

// ------------------------- MAESTROS -------------------------
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
        li.innerHTML = `<div><strong>${maestro.nombre}</strong> <span class="small-muted">Especialidad: ${maestro.especialidad || '-'}</span></div>`;
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
    if (nuevoNombre === null) return;
    const nuevaEspecialidad = prompt('Modificar especialidad:', maestro.especialidad || '');
    if (nuevaEspecialidad === null) return;
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
            li.innerHTML = `<div><strong>${maestro.nombre}</strong> <span class="small-muted">Especialidad: ${maestro.especialidad || '-'}</span></div>`;
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

// ------------------------- HORARIOS -------------------------

// DOM references
const tablaHorarioSemanalBody = document.querySelector('#tabla-horario-semanal tbody');
const tablaHorarioSabatinoBody = document.querySelector('#tabla-horario-sabatino tbody');
const btnGuardarHorario = document.getElementById('btn-guardar-horario');
const btnActualizarHorario = document.getElementById('btn-actualizar-horario');
const selectCarreraHorario = document.getElementById('select-carrera-horario');
const btnPreviewHorario = document.getElementById('btn-preview-horario');
const btnExportExcel = document.getElementById('btn-exportar-excel');
const btnExportPDF = document.getElementById('btn-exportar-pdf');
const selectHorariosGuardados = document.getElementById('select-horarios-guardados');
const btnCargarHorario = document.getElementById('btn-cargar-horario');
const btnEliminarHorario = document.getElementById('btn-eliminar-horario');
const previewContainer = document.getElementById('preview-horario');

// Times definitions (skip the 09:30 break; we'll render it as a break row)
const tiemposSemana = ['07:00', '07:50', '08:40', '10:00', '10:50', '11:40', '12:30', '13:20'];
const tiemposSabatino = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

// horarioTemporal structure
let horarioTemporal = { semanal: {}, sabatino: [] };
let currentHorarioId = null; // id of loaded/edited horario

function limpiarHorarioTemporal() {
    horarioTemporal = { semanal: { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [] }, sabatino: [] };
    tiemposSemana.forEach(() => {
        // nothing - arrays will be filled on update
    });
}

// Generate semanal table (with break row at 09:30)
function generarTablaHorarioSemanal() {
    if (!tablaHorarioSemanalBody) return;
    tablaHorarioSemanalBody.innerHTML = '';

    // Generate morning rows (before break)
    for (let i = 0; i < tiemposSemana.length; i++) {
        // Insert break row before '10:00' (i === 3)
        if (i === 3) {
            const trBreak = document.createElement('tr');
            trBreak.classList.add('break-row');
            const tdTime = document.createElement('td');
            tdTime.textContent = '09:30';
            const tdBreak = document.createElement('td');
            tdBreak.colSpan = 5;
            tdBreak.textContent = 'RECESO 09:30 - 10:00 (No asignable)';
            trBreak.appendChild(tdTime);
            trBreak.appendChild(tdBreak);
            tablaHorarioSemanalBody.appendChild(trBreak);
        }

        const hora = tiemposSemana[i];
        const tr = document.createElement('tr');
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        tr.appendChild(tdHora);

        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].forEach(dia => {
            const td = document.createElement('td');
            td.dataset.dia = dia;
            td.dataset.index = i;
            td.classList.add('celda-horario');
            td.style.cssText = 'min-height: 48px;';
            td.addEventListener('click', function() {
                abrirModalAsignacion(this);
            });
            tr.appendChild(td);
        });
        tablaHorarioSemanalBody.appendChild(tr);
    }
}

// Generate sabatino table
function generarTablaHorarioSabatino() {
    if (!tablaHorarioSabatinoBody) return;
    tablaHorarioSabatinoBody.innerHTML = '';
    tiemposSabatino.forEach((hora, index) => {
        const tr = document.createElement('tr');
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        tr.appendChild(tdHora);
        const td = document.createElement('td');
        td.dataset.dia = 'sabado';
        td.dataset.index = index;
        td.classList.add('celda-horario');
        td.style.cssText = 'min-height: 48px;';
        td.addEventListener('click', function() {
            abrirModalAsignacion(this);
        });
        tr.appendChild(td);
        tablaHorarioSabatinoBody.appendChild(tr);
    });
}

// Open modal to assign materia+maestro
function abrirModalAsignacion(celda) {
    const materias = safeGetArray('materias');
    const maestros = safeGetArray('maestros');

    if (materias.length === 0) {
        alert('No hay materias disponibles. Agregue materias primero.');
        return;
    }
    if (maestros.length === 0) {
        alert('No hay maestros disponibles. Agregue maestros primero.');
        return;
    }

    // Build modal
    const modal = document.createElement('div');
    modal.id = 'modal-asignacion';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999;';
    modal.innerHTML = `
        <div style="background:#fff;padding:18px;border-radius:8px;width:420px;max-width:95%;">
            <h3 style="margin-top:0">Asignar Materia / Maestro</h3>
            <p>Día: <strong>${celda.dataset.dia}</strong> - Hora: <strong>${celda.parentElement.firstChild.textContent}</strong></p>
            <div style="margin-bottom:8px;">
                <label>Materia</label>
                <select id="modal-select-materia" style="width:100%;padding:8px;margin-top:6px;">
                    <option value="">-- Seleccione Materia --</option>
                    ${materias.map(m=>`<option value="${m.id}">${m.nombre} (${m.aula||'-'})</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom:10px;">
                <label>Maestro</label>
                <select id="modal-select-maestro" style="width:100%;padding:8px;margin-top:6px;">
                    <option value="">-- Seleccione Maestro --</option>
                    ${maestros.map(m=>`<option value="${m.id}">${m.nombre}</option>`).join('')}
                </select>
            </div>
            <div style="text-align:right;">
                <button id="modal-limpiar" style="background:#f44336;color:#fff;padding:8px 12px;border-radius:6px;border:0;margin-right:8px;">Limpiar</button>
                <button id="modal-guardar" style="background:#4caf50;color:#fff;padding:8px 12px;border-radius:6px;border:0;margin-right:8px;">Guardar</button>
                <button id="modal-cancel" style="background:#ccc;padding:8px 12px;border-radius:6px;border:0;">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Prefill if exists
    if (celda.dataset.materiaId) document.getElementById('modal-select-materia').value = celda.dataset.materiaId;
    if (celda.dataset.maestroId) document.getElementById('modal-select-maestro').value = celda.dataset.maestroId;

    // Attach handlers
    document.getElementById('modal-cancel').onclick = () => { document.body.removeChild(modal); };
    document.getElementById('modal-limpiar').onclick = () => {
        celda.innerHTML = '';
        celda.dataset.materiaId = '';
        celda.dataset.maestroId = '';
        actualizarHorarioTemporal();
        document.body.removeChild(modal);
    };
    document.getElementById('modal-guardar').onclick = () => {
        guardarAsignacionModal(celda);
        document.body.removeChild(modal);
    };
}

// Save assignment from modal with conflict checks
function guardarAsignacionModal(celda) {
    const materiaId = document.getElementById('modal-select-materia').value;
    const maestroId = document.getElementById('modal-select-maestro').value;
    if (!materiaId || !maestroId) { alert('Seleccione materia y maestro'); return; }

    const materias = safeGetArray('materias');
    const maestros = safeGetArray('maestros');
    const materia = materias.find(m=>m.id===materiaId);
    const maestro = maestros.find(m=>m.id===maestroId);
    if (!materia || !maestro) { alert('Error al obtener materia o maestro'); return; }

    // Determine slot descriptor
    const dia = celda.dataset.dia;
    const index = parseInt(celda.dataset.index,10);
    const horarioKey = (dia === 'sabado') ? `sab-${index}` : `${dia}-${index}`;

    // Conflict detection across all saved horarios and current temporal horario
    const horariosGuardados = safeGetArray('horarios');
    // function to check if given schedule object has conflict with this slot
    function scheduleHasConflict(schedule) {
        // semanal
        if (schedule.semanal) {
            const days = ['lunes','martes','miercoles','jueves','viernes'];
            for (let d of days) {
                const arr = schedule.semanal[d] || [];
                const cell = arr[index];
                if (!cell) continue;
                if (cell.maestroId === maestroId) return { type:'maestro', schedule };
                if (cell.materiaId === materiaId) return { type:'materia', schedule };
                // check aula conflict if materia exists and has aula
                const mat = (cell.materiaId) ? safeGetArray('materias').find(m=>m.id===cell.materiaId) : null;
                if (mat && mat.aula && materia.aula && mat.aula === materia.aula) return { type:'aula', schedule };
            }
        }
        // sabatino
        if (schedule.sabatino) {
            const cell = schedule.sabatino[index];
            if (cell) {
                if (cell.maestroId === maestroId) return { type:'maestro', schedule };
                if (cell.materiaId === materiaId) return { type:'materia', schedule };
                const mat = (cell.materiaId) ? safeGetArray('materias').find(m=>m.id===cell.materiaId) : null;
                if (mat && mat.aula && materia.aula && mat.aula === materia.aula) return { type:'aula', schedule };
            }
        }
        return null;
    }

    // Check within saved schedules
    for (let s of horariosGuardados) {
        const conflict = scheduleHasConflict(s);
        if (conflict) {
            alert(`Conflicto detectado: ${conflict.type.toUpperCase()} ya ocupado en otro horario guardado.`);
            return;
        }
    }

    // Also check current temporal horario to avoid double-assigning a teacher to two different slots at same time across days
    // Check teacher not assigned in same index on other days in horarioTemporal
    const days = ['lunes','martes','miercoles','jueves','viernes'];
    for (let d of days) {
        const arr = horarioTemporal.semanal[d] || [];
        const cell = arr[index];
        if (cell && cell.maestroId === maestroId && celda.dataset.dia !== d) {
            alert('Conflicto detectado: el maestro ya tiene asignada otra clase a la misma hora en este horario temporal.');
            return;
        }
        if (cell && cell.materiaId === materiaId && celda.dataset.dia !== d) {
            alert('Conflicto detectado: la materia está asignada en este horario temporal en la misma franja horaria.');
            return;
        }
    }
    // For sabatino check
    const sabCell = horarioTemporal.sabatino[index];
    if (celda.dataset.dia === 'sabado') {
        if (sabCell && (sabCell.maestroId === maestroId || sabCell.materiaId === materiaId)){
            alert('Conflicto detectado en horario sabatino temporal.');
            return;
        }
    }

    // If passes checks, assign to cell
    celda.dataset.materiaId = materiaId;
    celda.dataset.maestroId = maestroId;
    celda.innerHTML = `<strong>${materia.nombre}</strong><br><small>${maestro.nombre} - ${materia.aula || ''}</small>`;

    actualizarHorarioTemporal();
}

// Update horarioTemporal from DOM
function actualizarHorarioTemporal() {
    // ensure structure
    horarioTemporal.semanal = { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [] };
    // semanal
    const celdasSemanales = document.querySelectorAll('#tabla-horario-semanal .celda-horario');
    celdasSemanales.forEach(celda => {
        const dia = celda.dataset.dia;
        const index = parseInt(celda.dataset.index,10);
        if (!horarioTemporal.semanal[dia]) horarioTemporal.semanal[dia] = [];
        while (horarioTemporal.semanal[dia].length <= index) horarioTemporal.semanal[dia].push({});
        horarioTemporal.semanal[dia][index] = { materiaId: celda.dataset.materiaId || null, maestroId: celda.dataset.maestroId || null };
    });
    // sabatino
    horarioTemporal.sabatino = [];
    const celdasSabatinas = document.querySelectorAll('#tabla-horario-sabatino .celda-horario');
    celdasSabatinas.forEach(celda => {
        const index = parseInt(celda.dataset.index,10);
        while (horarioTemporal.sabatino.length <= index) horarioTemporal.sabatino.push({});
        horarioTemporal.sabatino[index] = { materiaId: celda.dataset.materiaId || null, maestroId: celda.dataset.maestroId || null };
    });
}

// Load horario object into tables
function cargarHorarioEnTablas(horario) {
    if (!horario) return;
    // clear first
    generarTablaHorarioSemanal();
    generarTablaHorarioSabatino();
    // semanal
    const celdasSemanales = document.querySelectorAll('#tabla-horario-semanal .celda-horario');
    celdasSemanales.forEach(celda => {
        const dia = celda.dataset.dia;
        const index = parseInt(celda.dataset.index,10);
        if (horario.semanal && horario.semanal[dia] && horario.semanal[dia][index]) {
            const asign = horario.semanal[dia][index];
            if (asign && asign.materiaId && asign.maestroId) {
                const materia = Storage.get('materias').find(m=>m.id===asign.materiaId);
                const maestro = Storage.get('maestros').find(m=>m.id===asign.maestroId);
                if (materia && maestro) {
                    celda.dataset.materiaId = asign.materiaId;
                    celda.dataset.maestroId = asign.maestroId;
                    celda.innerHTML = `<strong>${materia.nombre}</strong><br><small>${maestro.nombre} - ${materia.aula||''}</small>`;
                }
            }
        }
    });
    // sabatino
    const celdasSabatinas = document.querySelectorAll('#tabla-horario-sabatino .celda-horario');
    celdasSabatinas.forEach(celda => {
        const index = parseInt(celda.dataset.index,10);
        if (horario.sabatino && horario.sabatino[index]) {
            const asign = horario.sabatino[index];
            if (asign && asign.materiaId && asign.maestroId) {
                const materia = Storage.get('materias').find(m=>m.id===asign.materiaId);
                const maestro = Storage.get('maestros').find(m=>m.id===asign.maestroId);
                if (materia && maestro) {
                    celda.dataset.materiaId = asign.materiaId;
                    celda.dataset.maestroId = asign.maestroId;
                    celda.innerHTML = `<strong>${materia.nombre}</strong><br><small>${maestro.nombre} - ${materia.aula||''}</small>`;
                }
            }
        }
    });
    // sync temporal and current id
    horarioTemporal = JSON.parse(JSON.stringify(horario));
}

// Save horario (create or update)
if (btnGuardarHorario) {
    btnGuardarHorario.addEventListener('click', () => {
        const carreraId = selectCarreraHorario.value;
        if (!carreraId) { alert('Seleccione una carrera antes de guardar.'); return; }
        actualizarHorarioTemporal();
        const horarios = safeGetArray('horarios');
        // find by carrera
        const existente = horarios.find(h => h.carreraId === carreraId);
        if (existente) {
            // update existente
            existente.semanal = horarioTemporal.semanal;
            existente.sabatino = horarioTemporal.sabatino;
            Storage.update('horarios', existente.id, existente);
            currentHorarioId = existente.id;
        } else {
            const nuevo = { id: generateId(), carreraId: carreraId, semanal: horarioTemporal.semanal, sabatino: horarioTemporal.sabatino, createdAt: new Date().toISOString() };
            Storage.add('horarios', nuevo);
            currentHorarioId = nuevo.id;
        }
        cargarHorariosGuardadosSelect();
        alert('Horario guardado correctamente.');
    });
}

// Update horario - ensures existing horario is updated (does not create duplicates)
if (btnActualizarHorario) {
    btnActualizarHorario.addEventListener('click', () => {
        if (!currentHorarioId) { alert('No hay horario cargado para actualizar. Cargue uno o guarde primero.'); return; }
        actualizarHorarioTemporal();
        const horarios = safeGetArray('horarios');
        const index = horarios.findIndex(h => h.id === currentHorarioId);
        if (index === -1) { alert('Horario no encontrado en almacenamiento.'); return; }
        horarios[index].semanal = horarioTemporal.semanal;
        horarios[index].sabatino = horarioTemporal.sabatino;
        horarios[index].updatedAt = new Date().toISOString();
        Storage.set('horarios', horarios);
        cargarHorariosGuardadosSelect();
        alert('Horario actualizado correctamente.');
    });
}

// On carrer select change: regenerate tables and load saved horario if exists
if (selectCarreraHorario) {
    selectCarreraHorario.addEventListener('change', () => {
        const carreraId = selectCarreraHorario.value;
        generarTablaHorarioSemanal();
        generarTablaHorarioSabatino();
        limpiarHorarioTemporal();
        currentHorarioId = null;
        if (!carreraId) return;
        const horarios = safeGetArray('horarios');
        const guardado = horarios.find(h => h.carreraId === carreraId);
        if (guardado) {
            cargarHorarioEnTablas(guardado);
            currentHorarioId = guardado.id;
        }
    });
}

// Load saved horarios into select
function cargarHorariosGuardadosSelect() {
    const select = selectHorariosGuardados;
    if (!select) return;
    select.innerHTML = '<option value="">-- Ninguno --</option>';
    const horarios = safeGetArray('horarios');
    const carreras = safeGetArray('carreras');
    horarios.forEach(h => {
        const carrera = carreras.find(c=>c.id===h.carreraId);
        const text = carrera ? `${carrera.nombre} (${carrera.grado||'-'}${carrera.grupo?(' - '+carrera.grupo):''})` : `Horario ${h.id}`;
        const opt = document.createElement('option');
        opt.value = h.id;
        opt.textContent = text;
        select.appendChild(opt);
    });
}

// Load selected saved horario on button click
if (btnCargarHorario) {
    btnCargarHorario.addEventListener('click', () => {
        const id = selectHorariosGuardados.value;
        if (!id) { alert('Seleccione un horario guardado.'); return; }
        const horario = Storage.get('horarios').find(h=>h.id===id);
        if (!horario) { alert('Horario no encontrado.'); return; }
        // set carrera select to that carrera
        selectCarreraHorario.value = horario.carreraId;
        generarTablaHorarioSemanal();
        generarTablaHorarioSabatino();
        cargarHorarioEnTablas(horario);
        currentHorarioId = horario.id;
        alert('Horario cargado para edición.');
    });
}

// Delete selected saved horario
if (btnEliminarHorario) {
    btnEliminarHorario.addEventListener('click', () => {
        const id = selectHorariosGuardados.value;
        if (!id) { alert('Seleccione un horario guardado.'); return; }
        if (!confirm('¿Eliminar horario seleccionado?')) return;
        Storage.delete('horarios', id);
        cargarHorariosGuardadosSelect();
        alert('Horario eliminado.');
    });
}

// Preview - render a friendly visual of the current horarioTemporal
if (btnPreviewHorario) {
    btnPreviewHorario.addEventListener('click', () => {
        actualizarHorarioTemporal();
        renderPreview();
    });
}

function renderPreview() {
    // Build a clean visual preview with headings and both tables
    const carreras = safeGetArray('carreras');
    const carrera = carreras.find(c=>c.id===selectCarreraHorario.value);
    const carreraTitle = carrera ? `${carrera.nombre} (G:${carrera.grado||'-'} - ${carrera.grupo||'-'})` : 'Carrera: --';
    const html = [];
    html.push(`<div class="preview-title"><h3>Preview de Horario</h3><div class="small-muted">${carreraTitle}</div></div>`);
    // semanal table
    html.push('<table style="width:100%;border-collapse:collapse;margin-bottom:12px;"><thead><tr style="background:#0077c8;color:#fff;"><th>Hora</th><th>Lun</th><th>Mar</th><th>Mie</th><th>Jue</th><th>Vie</th></tr></thead><tbody>');
    for (let i=0;i<tiemposSemana.length;i++) {
        if (i===3) {
            html.push(`<tr style="background:#fff3cd;font-weight:700;"><td>09:30</td><td colspan="5">RECESO 09:30 - 10:00</td></tr>`);
        }
        const hora = tiemposSemana[i];
        html.push(`<tr><td>${hora}</td>`);
        ['lunes','martes','miercoles','jueves','viernes'].forEach(dia => {
            const cell = (horarioTemporal.semanal && horarioTemporal.semanal[dia] && horarioTemporal.semanal[dia][i]) ? horarioTemporal.semanal[dia][i] : {};
            if (cell && cell.materiaId && cell.maestroId) {
                const materia = Storage.get('materias').find(m=>m.id===cell.materiaId);
                const maestro = Storage.get('maestros').find(m=>m.id===cell.maestroId);
                const txt = `${materia ? materia.nombre : 'Materia'} / ${maestro ? maestro.nombre : 'Maestro'} ${materia && materia.aula ? '('+materia.aula+')' : ''}`;
                html.push(`<td>${txt}</td>`);
            } else {
                html.push('<td></td>');
            }
        });
        html.push('</tr>');
    }
    html.push('</tbody></table>');

    // sabatino preview
    html.push('<h4 style="margin:8px 0 6px 0;color:#00274d;">Sabatino</h4>');
    html.push('<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#0077c8;color:#fff;"><th>Hora</th><th>Sáb</th></tr></thead><tbody>');
    for (let i=0;i<tiemposSabatino.length;i++) {
        const hora = tiemposSabatino[i];
        html.push(`<tr><td>${hora}</td>`);
        const cell = (horarioTemporal.sabatino && horarioTemporal.sabatino[i]) ? horarioTemporal.sabatino[i] : {};
        if (cell && cell.materiaId && cell.maestroId) {
            const materia = Storage.get('materias').find(m=>m.id===cell.materiaId);
            const maestro = Storage.get('maestros').find(m=>m.id===cell.maestroId);
            const txt = `${materia ? materia.nombre : 'Materia'} / ${maestro ? maestro.nombre : 'Maestro'} ${materia && materia.aula ? '('+materia.aula+')' : ''}`;
            html.push(`<td>${txt}</td>`);
        } else {
            html.push('<td></td>');
        }
        html.push('</tr>');
    }
    html.push('</tbody></table>');
    previewContainer.innerHTML = html.join('');
}

// Export to Excel - professional layout
if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
        actualizarHorarioTemporal();
        const workbook = XLSX.utils.book_new();
        // Semanal sheet
        const header = ['Hora','Lunes','Martes','Miércoles','Jueves','Viernes'];
        const rows = [];
        for (let i=0;i<tiemposSemana.length;i++) {
            if (i===3) {
                rows.push(['09:30','RECESO 09:30 - 10:00','','','','']);
            }
            const fila = [tiemposSemana[i]];
            ['lunes','martes','miercoles','jueves','viernes'].forEach(dia => {
                const cell = (horarioTemporal.semanal && horarioTemporal.semanal[dia] && horarioTemporal.semanal[dia][i]) ? horarioTemporal.semanal[dia][i] : {};
                if (cell && cell.materiaId && cell.maestroId) {
                    const materia = Storage.get('materias').find(m=>m.id===cell.materiaId);
                    const maestro = Storage.get('maestros').find(m=>m.id===cell.maestroId);
                    fila.push(`${materia ? materia.nombre : ''} / ${maestro ? maestro.nombre : ''} ${materia && materia.aula ? '('+materia.aula+')' : ''}`);
                } else fila.push('');
            });
            rows.push(fila);
        }
        const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
        XLSX.utils.book_append_sheet(workbook, ws, 'Semanal');

        // Sabatino sheet
        const headerS = ['Hora','Sábado'];
        const rowsS = tiemposSabatino.map((hora,i)=>{
            const cell = (horarioTemporal.sabatino && horarioTemporal.sabatino[i]) ? horarioTemporal.sabatino[i] : {};
            if (cell && cell.materiaId && cell.maestroId) {
                const materia = Storage.get('materias').find(m=>m.id===cell.materiaId);
                const maestro = Storage.get('maestros').find(m=>m.id===cell.maestroId);
                return [hora, `${materia ? materia.nombre : ''} / ${maestro ? maestro.nombre : ''} ${materia && materia.aula ? '('+materia.aula+')' : ''}`];
            }
            return [hora,''];
        });
        const ws2 = XLSX.utils.aoa_to_sheet([headerS, ...rowsS]);
        XLSX.utils.book_append_sheet(workbook, ws2, 'Sabatino');

        const carrera = Storage.get('carreras').find(c=>c.id===selectCarreraHorario.value);
        const fileName = carrera ? `${carrera.nombre}_Horario.xlsx` : 'Horario.xlsx';
        XLSX.writeFile(workbook, fileName);
    });
}

// Export to PDF - professional format using autoTable
if (btnExportPDF) {
    btnExportPDF.addEventListener('click', () => {
        actualizarHorarioTemporal();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        const title = 'Horario - Universidad del Golfo';
        doc.setFontSize(14);
        doc.text(title, 14, 16);

        // Semanal table data for autoTable
        const head = [['Hora','Lunes','Martes','Miércoles','Jueves','Viernes']];
        const body = [];
        for (let i=0;i<tiemposSemana.length;i++) {
            if (i===3) {
                body.push(['09:30','RECESO 09:30 - 10:00','','','','']);
            }
            const fila = [tiemposSemana[i]];
            ['lunes','martes','miercoles','jueves','viernes'].forEach(dia => {
                const cell = (horarioTemporal.semanal && horarioTemporal.semanal[dia] && horarioTemporal.semanal[dia][i]) ? horarioTemporal.semanal[dia][i] : {};
                if (cell && cell.materiaId && cell.maestroId) {
                    const materia = Storage.get('materias').find(m=>m.id===cell.materiaId);
                    const maestro = Storage.get('maestros').find(m=>m.id===cell.maestroId);
                    fila.push(`${materia ? materia.nombre : ''}\n${maestro ? maestro.nombre : ''}${materia && materia.aula ? '\nAula: '+materia.aula : ''}`);
                } else fila.push('');
            });
            body.push(fila);
        }
        doc.autoTable({ startY: 24, head: head, body: body, styles:{fontSize:9}, headStyles:{fillColor:[0,119,200]} });

        // Sabatino - next page
        doc.addPage('landscape');
        doc.setFontSize(14);
        doc.text('Sabatino',14,16);
        const headS = [['Hora','Sábado']];
        const bodyS = tiemposSabatino.map((hora,i)=>{
            const cell = (horarioTemporal.sabatino && horarioTemporal.sabatino[i]) ? horarioTemporal.sabatino[i] : {};
            if (cell && cell.materiaId && cell.maestroId) {
                const materia = Storage.get('materias').find(m=>m.id===cell.materiaId);
                const maestro = Storage.get('maestros').find(m=>m.id===cell.maestroId);
                return [hora, `${materia ? materia.nombre : ''}\n${maestro ? maestro.nombre : ''}${materia && materia.aula ? '\nAula: '+materia.aula : ''}`];
            }
            return [hora,''];
        });
        doc.autoTable({ startY: 24, head: headS, body: bodyS, styles:{fontSize:10}, headStyles:{fillColor:[0,119,200]} });

        const carrera = Storage.get('carreras').find(c=>c.id===selectCarreraHorario.value);
        const fileName = carrera ? `${carrera.nombre}_Horario.pdf` : 'Horario.pdf';
        doc.save(fileName);
    });
}

// Initialization
function inicializar() {
    cargarCarrerasSelect();
    generarTablaHorarioSemanal();
    generarTablaHorarioSabatino();
    limpiarHorarioTemporal();
    cargarHorariosGuardadosSelect();
    loadCarreras();
    loadMaterias();
    loadMaestros();
}

inicializar();
